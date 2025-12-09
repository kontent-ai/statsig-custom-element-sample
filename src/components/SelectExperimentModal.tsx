import { type FC, useState, useCallback } from 'react';
import type { StatsigExperiment } from '../types';
import { hasMatchingVariants } from '../utils/experimentUtils';
import { StatusBadge } from './StatusBadge';
import { ExperimentVariants } from './ExperimentVariants';
import styles from './SelectExperimentModal.module.css';

type SelectExperimentModalProps = {
  readonly experiments: ReadonlyArray<StatsigExperiment>;
  readonly onSelect: (experimentId: string) => void;
  readonly onClose: () => void;
};

export const SelectExperimentModal: FC<SelectExperimentModalProps> = ({
  experiments,
  onSelect,
  onClose,
}) => {
  const [selectedExperiment, setSelectedExperiment] = useState<StatsigExperiment | null>(null);
  const [showWarningConfirm, setShowWarningConfirm] = useState(false);

  const handleExperimentClick = useCallback((experiment: StatsigExperiment) => {
    setSelectedExperiment(experiment);
    const hasMatching = hasMatchingVariants(experiment);
    if (hasMatching) {
      onSelect(experiment.id);
    } else {
      setShowWarningConfirm(true);
    }
  }, [onSelect]);

  const handleConfirmWithWarning = useCallback(() => {
    if (selectedExperiment) {
      onSelect(selectedExperiment.id);
    }
  }, [selectedExperiment, onSelect]);

  const handleCancelWarning = useCallback(() => {
    setShowWarningConfirm(false);
    setSelectedExperiment(null);
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (showWarningConfirm && selectedExperiment) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.warningHeader}>
            <svg className={styles.warningIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className={styles.warningTitle}>Variant Mismatch Warning</h3>
          </div>
          <p className={styles.warningMessage}>
            The experiment "<strong>{selectedExperiment.name}</strong>" doesn't have the expected 'control' and 'test' variants with matching parameter values. It may not work correctly with this element.
          </p>
          <div className={styles.warningActions}>
            <button
              type="button"
              onClick={handleCancelWarning}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmWithWarning}
              className={styles.warningButton}
            >
              Link Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Select Existing Experiment</h3>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.experimentList}>
          {experiments.map((experiment) => {
            const hasMatching = hasMatchingVariants(experiment);
            return (
              <button
                key={experiment.id}
                type="button"
                className={styles.experimentItem}
                onClick={() => handleExperimentClick(experiment)}
              >
                <div className={styles.experimentHeader}>
                  <span className={styles.experimentName}>{experiment.name}</span>
                  <StatusBadge status={experiment.status} />
                </div>
                <ExperimentVariants groups={experiment.groups} />
                {!hasMatching && (
                  <div className={styles.mismatchWarning}>
                    <svg className={styles.mismatchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Variants don't match expected structure</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
