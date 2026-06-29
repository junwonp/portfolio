'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from 'lucide-react';

import SkillSelectorDialog from '@/lib/components/SkillSelectorDialog';
import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { ContentOverrideArea } from '@/lib/server/editableContentStore';
import type { Language } from '@/lib/utils/language';

import styles from './EditableContentButton.module.css';
import {
  allSkillNames,
  blockTypes,
  buildContentOverridePayload,
  createArrayItemTemplate,
  createBlockTemplate,
  type EditablePath,
  type EditableRecord,
  type EditableValue,
  formatMarkdownListTextarea,
  getValueAtPath,
  isLongTextField,
  isMarkdownListTextareaField,
  isMonthInputField,
  isRecord,
  isSkillListField,
  labelFor,
  moveAtPath,
  normalizeInitialValue,
  parseMarkdownListTextarea,
  removeAtPath,
  syncFeaturedSkillsWithSkills,
  toStringList,
  updateAtPath,
} from './editableContentEditorModel';

export interface EditableContentRenderProps {
  editor: React.ReactNode;
  isEditing: boolean;
  trigger: React.ReactNode;
}

interface Props {
  area: ContentOverrideArea;
  children?: React.ReactNode | ((props: EditableContentRenderProps) => React.ReactNode);
  hiddenFields?: string[];
  initialValue: unknown;
  label: string;
  locale: Language;
  mode?: 'dialog' | 'inline';
  payloadBuilder?: (value: EditableValue) => unknown;
  stopPropagation?: boolean;
  targetKey: string;
  textareaLabel?: string;
  triggerKind?: 'add' | 'edit';
}

export default function EditableContentButton({
  area,
  children,
  hiddenFields = [],
  initialValue,
  label,
  locale,
  mode = 'inline',
  payloadBuilder,
  stopPropagation = false,
  targetKey,
  textareaLabel = label,
  triggerKind,
}: Props) {
  const buttonLabel = label.endsWith('수정') || label.endsWith('추가') ? label : `${label} 수정`;
  const actionKind = triggerKind ?? (buttonLabel.includes('추가') ? 'add' : 'edit');
  const TriggerIcon = actionKind === 'add' ? Plus : Pencil;
  const hiddenFieldSet = new Set(hiddenFields);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [value, setValue] = useState<EditableValue>(() =>
    normalizeInitialValue(area, targetKey, initialValue),
  );

  const handleOpen = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event?.stopPropagation();
    }
    setValue(normalizeInitialValue(area, targetKey, initialValue));
    setIsOpen(true);
  };

  const updateValue = (path: EditablePath, nextValue: EditableValue) => {
    setValue((current) => updateAtPath(current, path, nextValue));
  };

  const addArrayItem = (path: EditablePath, key: string) => {
    setValue((current) => {
      const list = getValueAtPath(current, path);
      if (!Array.isArray(list)) return current;

      return updateAtPath(current, path, [...list, createArrayItemTemplate(key, list.length)]);
    });
  };

  const handleBlockTypeChange = (path: EditablePath, type: ProjectDetailBlock['type']) => {
    setValue((current) => {
      const currentValue = getValueAtPath(current, path);
      const next = createBlockTemplate(type, 0);
      if (isRecord(currentValue) && typeof currentValue.id === 'string') {
        next.id = currentValue.id;
      }
      return updateAtPath(current, path, next);
    });
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const normalizedValue = syncFeaturedSkillsWithSkills(value);
      const response = await fetch('/api/admin/content-overrides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          area,
          locale,
          payload: payloadBuilder
            ? payloadBuilder(normalizedValue)
            : buildContentOverridePayload(area, targetKey, normalizedValue),
          targetKey,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? '저장에 실패했습니다.');
      }

      window.location.reload();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStringList = (list: EditableValue[], path: EditablePath, key: string) => {
    const usesSkillSuggestions = isSkillListField(key, targetKey);

    if (isMarkdownListTextareaField(key)) {
      return (
        <textarea
          className={styles.textarea}
          value={formatMarkdownListTextarea(toStringList(list))}
          onChange={(event) => updateValue(path, parseMarkdownListTextarea(event.target.value))}
        />
      );
    }

    return (
      <div className={styles['list-field']}>
        {usesSkillSuggestions && (
          <SkillSelectorDialog
            allowCustom={key !== 'featuredSkills'}
            candidates={getSkillCandidates(path, key)}
            emptyMessage={
              key === 'featuredSkills'
                ? '먼저 일반 Skills에서 featured로 보여줄 스킬을 선택하세요.'
                : undefined
            }
            label={labelFor(key)}
            selected={getSelectedSkills(list, path, key)}
            onChange={(next) => updateValue(path, next)}
          />
        )}

        {!usesSkillSuggestions && (
          <>
            {list.map((item, index) => (
              <div key={index} className={styles['inline-row']}>
                <input
                  className={styles.input}
                  value={typeof item === 'string' ? item : ''}
                  onChange={(event) => updateValue([...path, index], event.target.value)}
                />
                <IconButton
                  label="위로 이동"
                  disabled={index === 0}
                  onClick={() => setValue((current) => moveAtPath(current, path, index, -1))}
                >
                  <ArrowUp size={15} />
                </IconButton>
                <IconButton
                  label="아래로 이동"
                  disabled={index === list.length - 1}
                  onClick={() => setValue((current) => moveAtPath(current, path, index, 1))}
                >
                  <ArrowDown size={15} />
                </IconButton>
                <IconButton
                  label="삭제"
                  onClick={() => setValue((current) => removeAtPath(current, path, index))}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            ))}

            <button
              className={styles['add-button']}
              type="button"
              onClick={() => addArrayItem(path, key)}
            >
              <Plus size={15} aria-hidden="true" />
              항목 추가
            </button>
          </>
        )}
      </div>
    );
  };

  const getSkillCandidates = (path: EditablePath, key: string): string[] => {
    if (key !== 'featuredSkills') return allSkillNames;

    const parentValue = getValueAtPath(value, path.slice(0, -1));
    return isRecord(parentValue) ? toStringList(parentValue.skills) : [];
  };

  const getSelectedSkills = (list: EditableValue[], path: EditablePath, key: string): string[] => {
    const selected = toStringList(list);
    if (key !== 'featuredSkills') return selected;

    const availableSkills = new Set(getSkillCandidates(path, key));
    return selected.filter((skill) => availableSkills.has(skill));
  };

  const renderArray = (list: EditableValue[], path: EditablePath, key: string) => {
    if (list.every((item) => typeof item === 'string')) {
      return renderStringList(list, path, key);
    }

    return (
      <div className={styles['card-list']}>
        {list.map((item, index) => (
          <section key={index} className={styles['field-card']}>
            <header className={styles['field-card-header']}>
              <strong>
                {key === 'blocks' && isRecord(item) && typeof item.type === 'string'
                  ? `${labelFor(key)} ${index + 1}: ${item.type}`
                  : `${labelFor(key)} ${index + 1}`}
              </strong>
              <div className={styles['card-actions']}>
                <IconButton
                  label="위로 이동"
                  disabled={index === 0}
                  onClick={() => setValue((current) => moveAtPath(current, path, index, -1))}
                >
                  <ArrowUp size={15} />
                </IconButton>
                <IconButton
                  label="아래로 이동"
                  disabled={index === list.length - 1}
                  onClick={() => setValue((current) => moveAtPath(current, path, index, 1))}
                >
                  <ArrowDown size={15} />
                </IconButton>
                <IconButton
                  label="삭제"
                  onClick={() => setValue((current) => removeAtPath(current, path, index))}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </header>

            {key === 'blocks' && isRecord(item) && (
              <label className={styles.field}>
                <span>블록 유형</span>
                <select
                  className={styles.input}
                  value={typeof item.type === 'string' ? item.type : 'markdown'}
                  onChange={(event) =>
                    handleBlockTypeChange(
                      [...path, index],
                      event.target.value as ProjectDetailBlock['type'],
                    )
                  }
                >
                  {blockTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {renderValue(item, [...path, index], key)}
          </section>
        ))}

        <button
          className={styles['add-button']}
          type="button"
          onClick={() => addArrayItem(path, key)}
        >
          <Plus size={15} aria-hidden="true" />
          {labelFor(key)} 추가
        </button>
      </div>
    );
  };

  const renderRecord = (record: EditableRecord, path: EditablePath, parentKey: string) => (
    <div className={styles['object-grid']}>
      {Object.entries(record).map(([key, item]) => {
        if (hiddenFieldSet.has(key) || (parentKey === 'blocks' && key === 'type')) {
          return null;
        }

        const isWide =
          Array.isArray(item) ||
          isRecord(item) ||
          (typeof item === 'string' && isLongTextField(key, item));

        return (
          <div
            key={key}
            className={`${styles['object-field']} ${isWide ? styles['wide-field'] : ''}`}
          >
            <span className={styles['field-label']}>{labelFor(key)}</span>
            {renderValue(item, [...path, key], key)}
          </div>
        );
      })}
    </div>
  );

  const renderValue = (item: EditableValue, path: EditablePath, key: string): React.ReactNode => {
    if (Array.isArray(item)) {
      return renderArray(item, path, key);
    }

    if (isRecord(item)) {
      return renderRecord(item, path, key);
    }

    if (typeof item === 'boolean') {
      return (
        <label className={styles['checkbox-field']}>
          <input
            type="checkbox"
            checked={item}
            onChange={(event) => updateValue(path, event.target.checked)}
          />
          <span>사용</span>
        </label>
      );
    }

    if (typeof item === 'number') {
      return (
        <input
          className={styles.input}
          type="number"
          value={item}
          onChange={(event) => updateValue(path, Number(event.target.value))}
        />
      );
    }

    const stringValue = typeof item === 'string' ? item : '';

    if (isLongTextField(key, stringValue)) {
      return (
        <textarea
          className={styles.textarea}
          value={stringValue}
          onChange={(event) => updateValue(path, event.target.value)}
        />
      );
    }

    return (
      <input
        className={styles.input}
        type={isMonthInputField(key) ? 'month' : 'text'}
        value={stringValue}
        pattern={isMonthInputField(key) ? '[0-9]{4}-[0-9]{2}' : undefined}
        onChange={(event) => updateValue(path, event.target.value)}
      />
    );
  };

  const triggerNode = (
    <button
      className={`${styles['edit-trigger']} ${actionKind === 'add' ? styles['add-trigger'] : ''}`}
      type="button"
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={handleOpen}
    >
      <TriggerIcon size={15} aria-hidden="true" />
      <span className={styles['sr-only']}>{buttonLabel}</span>
    </button>
  );

  const editorPanel = (
    <section
      className={`${styles['editor-panel']} ${mode === 'inline' ? styles['inline-editor-panel'] : ''}`}
      aria-label={textareaLabel}
    >
      <header className={styles['editor-header']}>
        <div>
          <span className={styles['editor-kicker']}>{targetKey}</span>
          <h2>{textareaLabel}</h2>
        </div>
        <button
          className={styles['icon-button']}
          type="button"
          aria-label="닫기"
          onClick={() => setIsOpen(false)}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className={styles['editor-scroll']}>
        {renderValue(value, [], targetKey.split('::').at(-1) ?? targetKey)}
      </div>

      {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

      <footer className={styles['editor-actions']}>
        <button className={styles['ghost-button']} type="button" onClick={() => setIsOpen(false)}>
          취소
        </button>
        <button
          className={styles['save-button']}
          type="button"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '수정 완료'}
        </button>
      </footer>
    </section>
  );

  const editorNode =
    mode === 'dialog' ? (
      isOpen ? (
        <div
          className={styles['editor-backdrop']}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          {editorPanel}
        </div>
      ) : null
    ) : isOpen ? (
      <div className={styles['inline-editor-shell']}>{editorPanel}</div>
    ) : null;

  if (typeof children === 'function') {
    return <>{children({ editor: editorNode, isEditing: isOpen, trigger: triggerNode })}</>;
  }

  if (children) {
    return (
      <div className={styles['editable-region']}>
        {isOpen ? editorNode : children}
        {!isOpen && <div className={styles['inline-trigger-row']}>{triggerNode}</div>}
      </div>
    );
  }

  return (
    <>
      {triggerNode}
      {editorNode}
    </>
  );
}

interface IconButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

function IconButton({ children, disabled = false, label, onClick }: IconButtonProps) {
  return (
    <button
      className={styles['mini-icon-button']}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      title={label}
    >
      {children}
    </button>
  );
}
