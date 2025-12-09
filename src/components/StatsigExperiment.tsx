import { useMemo } from 'react';
import { useValue, useItemInfo, useIsDisabled } from '../customElement/CustomElementContext';
import { getExperiment } from '../api/statsig';
import { ExperimentDetails } from './ExperimentDetails';
import { CreateExperiment } from './CreateExperiment';
import { useAsyncConditional } from '../hooks/useAsync';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { ErrorIcon } from '../icons/ErrorIcon';
import styles from './StatsigExperiment.module.css';

type Props = Readonly<{
  onHeightChange: () => void;
}>;

export const StatsigExperiment = ({ onHeightChange }: Props) => {
  const [value, setValue] = useValue();
  const itemInfo = useItemInfo();
  const isDisabled = useIsDisabled();

  const experimentId = value?.experimentId ?? null;

  const asyncFn = useMemo(
    () => experimentId ? async () => {
      const experiment = await getExperiment(experimentId);
      onHeightChange();
      return experiment;
    } : null,
    [experimentId, onHeightChange]
  );

  const { data: experiment, isLoading, error, refetch } = useAsyncConditional(
    asyncFn,
    [experimentId]
  );

  const handleCreated = (newExperimentId: string) => {
    setValue({ experimentId: newExperimentId });
  };

  const handleUnlink = () => {
    setValue(null);
  };

  if (!experimentId) {
    return (
      <CreateExperiment
        itemInfo={itemInfo}
        onCreated={handleCreated}
        onHeightChange={onHeightChange}
        isDisabled={isDisabled}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <SpinnerIcon className={styles.spinner} trackClassName={styles.spinnerTrack} headClassName={styles.spinnerHead} />
        <span className={styles.loadingText}>Loading experiment...</span>
      </div>
    );
  }

  if (error || !experiment) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <ErrorIcon className={styles.errorIcon} />
          <div className={styles.errorBody}>
            <h3 className={styles.errorTitle}>Experiment not found</h3>
            <p className={styles.errorMessage}>
              The experiment "<code className={styles.errorCode}>{experimentId}</code>" was not found in Statsig.
              It may have been deleted.
            </p>
            <div className={styles.errorActions}>
              <button
                type="button"
                onClick={() => refetch()}
                className={styles.errorLink}
              >
                Retry
              </button>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleUnlink}
                  className={styles.errorLink}
                >
                  Unlink experiment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ExperimentDetails
      experiment={experiment}
      onUnlink={handleUnlink}
      isDisabled={isDisabled}
    />
  );
};
