import { type FC, useCallback, useState } from 'react';
import { createExperiment, listExperiments } from '../api/statsig';
import { useMutation } from '../hooks/useMutation';
import { useAsync } from '../hooks/useAsync';
import { SelectExperimentModal } from './SelectExperimentModal';
import styles from './CreateExperiment.module.css';

type ItemInfo = {
  readonly id: string;
  readonly codename: string;
  readonly name: string;
};

type CreateExperimentProps = {
  readonly itemInfo: ItemInfo;
  readonly onCreated: (experimentId: string) => void;
  readonly onHeightChange: () => void;
  readonly isDisabled: boolean;
};

export const CreateExperiment: FC<CreateExperimentProps> = ({ itemInfo, onCreated, onHeightChange, isDisabled }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [experimentName, setExperimentName] = useState(itemInfo.codename);
  const [hypothesis, setHypothesis] = useState('');

  const { data: experiments, isLoading: isLoadingExperiments } = useAsync(listExperiments, []);
  
  const openForm = useCallback(() => {
    setIsFormOpen(true);
    onHeightChange();
  }, [onHeightChange]);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    onHeightChange();
  }, [onHeightChange]);

  const openSelectModal = useCallback(() => {
    setIsSelectModalOpen(true);
  }, []);

  const closeSelectModal = useCallback(() => {
    setIsSelectModalOpen(false);
  }, []);

  const handleSelectExperiment = useCallback((experimentId: string) => {
    onCreated(experimentId);
    closeSelectModal();
  }, [onCreated, closeSelectModal]);

  const mutation = useMutation(createExperiment, {
    onSuccess: (experiment) => {
      onCreated(experiment.id);
      closeForm();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experimentName.trim()) return;

    mutation.mutate({
      name: experimentName.trim(),
      hypothesis: hypothesis.trim() || undefined,
    });
  };

  const hasExperiments = experiments && experiments.length > 0;
  const isSelectDisabled = isLoadingExperiments || !hasExperiments;

  if (!isFormOpen) {
    return (
      <>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className={styles.emptyTitle}>No experiment linked</h3>
          <p className={styles.emptyDescription}>Create a new experiment or select an existing one from Statsig.</p>
          {!isDisabled && (
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={openForm}
                className={styles.primaryButton}
              >
                Create New
              </button>
              <button
                type="button"
                onClick={openSelectModal}
                className={styles.secondaryButton}
                disabled={isSelectDisabled}
                title={isSelectDisabled ? (isLoadingExperiments ? 'Loading experiments...' : 'No experiments available') : undefined}
              >
                {isLoadingExperiments ? 'Loading...' : 'Select Existing'}
              </button>
            </div>
          )}
        </div>
        {isSelectModalOpen && experiments && (
          <SelectExperimentModal
            experiments={experiments}
            onSelect={handleSelectExperiment}
            onClose={closeSelectModal}
          />
        )}
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create Statsig Experiment</h3>

      <div className={styles.formFields}>
        <div className={styles.fieldGroup}>
          <label htmlFor="experimentName" className={styles.label}>
            Experiment Name *
          </label>
          <input
            type="text"
            id="experimentName"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
            className={styles.input}
            placeholder="e.g., hero_cta_experiment"
            required
          />
          <p className={styles.hint}>
            Use lowercase letters, numbers, and underscores
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="hypothesis" className={styles.label}>
            Hypothesis (optional)
          </label>
          <textarea
            id="hypothesis"
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            rows={2}
            className={styles.textarea}
            placeholder="What do you expect to happen?"
          />
        </div>

        <div className={styles.infoBox}>
          <p><strong>Groups:</strong> control (50%) and test (50%)</p>
        </div>
      </div>

      {mutation.error && (
        <div className={styles.errorMessage}>
          {mutation.error instanceof Error ? mutation.error.message : 'Failed to create experiment'}
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={closeForm}
          className={styles.secondaryButton}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={mutation.isPending || !experimentName.trim()}
        >
          {mutation.isPending ? (
            <>
              <svg className={styles.spinner} fill="none" viewBox="0 0 24 24">
                <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : (
            'Create Experiment'
          )}
        </button>
      </div>
    </form>
  );
};
