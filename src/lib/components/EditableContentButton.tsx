"use client";

import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

import type { ContentOverrideArea } from "@/lib/server/editableContentStore";
import type { Language } from "@/lib/utils/language";

import styles from "./EditableContentButton.module.css";

interface Props {
  area: ContentOverrideArea;
  initialValue: unknown;
  label: string;
  locale: Language;
  targetKey: string;
  textareaLabel?: string;
}

export default function EditableContentButton({
  area,
  initialValue,
  label,
  locale,
  targetKey,
  textareaLabel = label,
}: Props) {
  const buttonLabel = `${label} 수정`;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [value, setValue] = useState("");

  const formatInitialValue = () => {
    return typeof initialValue === "string"
      ? initialValue
      : JSON.stringify(initialValue, null, 2);
  };

  const handleOpen = () => {
    setValue(formatInitialValue());
    setIsOpen(true);
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const payload: unknown =
        area === "home" ? JSON.parse(value) : { markdown: value };
      const response = await fetch("/api/admin/content-overrides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          area,
          locale,
          payload,
          targetKey,
        }),
      });

      if (!response.ok) {
        throw new Error("저장에 실패했습니다.");
      }

      window.location.reload();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "저장에 실패했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        className={styles["edit-trigger"]}
        type="button"
        aria-label={buttonLabel}
        onClick={handleOpen}
      >
        <Pencil size={14} aria-hidden="true" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <div
          className={styles["editor-backdrop"]}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <section className={styles["editor-panel"]} aria-label={textareaLabel}>
            <header className={styles["editor-header"]}>
              <h2>{textareaLabel}</h2>
              <button
                className={styles["icon-button"]}
                type="button"
                aria-label="닫기"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <textarea
              className={styles.textarea}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={textareaLabel}
            ></textarea>

            {errorMessage && (
              <p className={styles["error-message"]}>{errorMessage}</p>
            )}

            <footer className={styles["editor-actions"]}>
              <button
                className={styles["ghost-button"]}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button
                className={styles["save-button"]}
                type="button"
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
