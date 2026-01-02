import type { FC } from 'react';
import type { StatsigExperiment } from '../types';
import { getExperimentConsoleUrl } from '../api/statsig';
import { StatusBadge } from './StatusBadge';
import { ExperimentVariants } from './ExperimentVariants';
import { CheckIcon } from '../icons/CheckIcon';
import { ExternalLinkIcon } from '../icons/ExternalLinkIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import styles from './ExperimentDetails.module.css';

type ExperimentDetailsProps = {
  readonly experiment: StatsigExperiment;
  readonly onUnlink: () => void;
  readonly onConclude?: () => void;
  readonly isDisabled: boolean;
};

export const ExperimentDetails: FC<ExperimentDetailsProps> = ({ experiment, onUnlink, onConclude, isDisabled }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <CheckIcon className={styles.checkIcon} />
        <span className={styles.title}>{experiment.name}</span>
      </div>
      <StatusBadge status={experiment.status} />
    </div>

    {experiment.hypothesis && (
      <p className={styles.hypothesis}>{experiment.hypothesis}</p>
    )}

    <ExperimentVariants groups={experiment.groups} />

    <div className={styles.footer}>
      <a
        href={getExperimentConsoleUrl(experiment.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.externalLink}
      >
        Open in Statsig
        <ExternalLinkIcon className={styles.externalLinkIcon} />
      </a>

      {!isDisabled && (
        <div className={styles.actionButtons}>
          {experiment.status === 'active' && onConclude && (
            <button
              type="button"
              onClick={onConclude}
              className={styles.concludeButton}
            >
              <TrophyIcon className={styles.concludeIcon} />
              Conclude
            </button>
          )}
          {experiment.status !== 'active' && (
            <span className={styles.concludeDisabled} title="Only active experiments can be concluded">
              <TrophyIcon className={styles.concludeIconDisabled} />
              Conclude
            </span>
          )}
          <button
            type="button"
            onClick={onUnlink}
            className={styles.unlinkButton}
          >
            Unlink
          </button>
        </div>
      )}
    </div>
  </div>
);
