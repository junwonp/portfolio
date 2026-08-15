'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { skillsShared } from '@/lib/portfolio/skills';

import * as styles from './SkillSelectorDialog.css';

interface SkillSelectorDialogProps {
  allowCustom?: boolean;
  candidates: string[];
  emptyMessage?: string;
  label: string;
  onChange: (next: string[]) => void;
  selected: string[];
}

const uniqueStrings = (values: string[]): string[] =>
  Array.from(
    new Set(
      values.flatMap((value) => {
        const trimmed = value.trim();
        return trimmed ? [trimmed] : [];
      })
    )
  );

export default function SkillSelectorDialog({
  allowCustom = false,
  candidates,
  emptyMessage = '선택 가능한 스킬이 없습니다.',
  label,
  onChange,
  selected,
}: SkillSelectorDialogProps) {
  const [customSkill, setCustomSkill] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedSkills = uniqueStrings(selected);
  const candidateSkills = uniqueStrings([...candidates, ...selectedSkills]);

  const groupedCandidates = (() => {
    const candidateSet = new Set(candidateSkills);
    const knownSkills = new Set<string>();
    const groups = skillsShared.flatMap((group) => {
      const list = group.list.filter((skill) => candidateSet.has(skill));
      if (list.length > 0) {
        list.forEach((skill) => knownSkills.add(skill));
        return [{ id: group.id, list }];
      }
      return [];
    });

    const custom = candidateSkills.filter((skill) => !knownSkills.has(skill));

    return custom.length > 0 ? [...groups, { id: 'custom', list: custom }] : groups;
  })();

  const selectedSet = new Set(selectedSkills);

  const updateSelected = (next: string[]) => {
    onChange(uniqueStrings(next));
  };

  const toggleSkill = (skill: string) => {
    updateSelected(
      selectedSet.has(skill)
        ? selectedSkills.filter((item) => item !== skill)
        : [...selectedSkills, skill],
    );
  };

  const addCustomSkill = () => {
    const nextSkill = customSkill.trim();
    if (!nextSkill) return;
    updateSelected([...selectedSkills, nextSkill]);
    setCustomSkill('');
  };

  return (
    <div className={styles.field}>
      <div className={styles.summary}>
        <div className={styles.selectedList}>
          {selectedSkills.length > 0 ? (
            selectedSkills.map((skill) => (
              <span key={skill} className={styles.selectedChip}>
                {skill}
              </span>
            ))
          ) : (
            <span className={styles.placeholder}>선택된 스킬 없음</span>
          )}
        </div>
        <button className={styles.openButton} type="button" onClick={() => setIsOpen(true)}>
          <Plus size={15} aria-hidden="true" />
          스킬 선택
        </button>
      </div>

      {isOpen && (
        <div
          className={styles.backdrop}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section className={styles.panel} aria-label={label}>
            <header className={styles.header}>
              <div>
                <span className={styles.kicker}>스킬 선택</span>
                <h3>{label}</h3>
              </div>
              <button
                className={styles.iconButton}
                type="button"
                aria-label="스킬 선택 닫기"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.content}>
              {groupedCandidates.length > 0 ? (
                groupedCandidates.map((group) => (
                  <div key={group.id} className={styles.group}>
                    <span className={styles.groupLabel}>{group.id}</span>
                    <div className={styles.chipGrid}>
                      {group.list.map((skill) => {
                        const isSelected = selectedSet.has(skill);
                        return (
                          <button
                            key={skill}
                            className={`${styles.chip} ${isSelected ? styles.selected : ''}`}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>{emptyMessage}</p>
              )}

              {allowCustom && (
                <div className={styles.customRow}>
                  <input
                    className={styles.input}
                    value={customSkill}
                    placeholder="직접 입력"
                    aria-label="직접 입력"
                    onChange={(event) => setCustomSkill(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCustomSkill();
                      }
                    }}
                  />
                  <button className={styles.addButton} type="button" onClick={addCustomSkill}>
                    추가
                  </button>
                </div>
              )}
            </div>

            <footer className={styles.actions}>
              <button
                className={styles.doneButton}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                선택 완료
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
