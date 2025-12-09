import type { FC } from 'react';
import type { StatsigExperiment } from '../types';
import { getExperimentConsoleUrl } from '../api/statsig';
import { StatusBadge } from './StatusBadge';
import styles from './ExperimentDetails.module.css';

type ExperimentDetailsProps = {
  readonly experiment: StatsigExperiment;
  readonly onUnlink: () => void;
  readonly isDisabled: boolean;
};

export const ExperimentDetails: FC<ExperimentDetailsProps> = ({ experiment, onUnlink, isDisabled }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className={styles.title}>{experiment.name}</span>
      </div>
      <StatusBadge status={experiment.status} />
    </div>

    {experiment.hypothesis && (
      <p className={styles.hypothesis}>{experiment.hypothesis}</p>
    )}

    {experiment.groups && experiment.groups.length > 0 && (
      <div className={styles.groupsSection}>
        <p className={styles.groupsLabel}>Groups:</p>
        <div className={styles.groupsList}>
          {experiment.groups.map((group) => (
            <span key={group.name} className={styles.groupTag}>
              {group.name} ({group.size}%)
            </span>
          ))}
        </div>
      </div>
    )}

    <div className={styles.footer}>
      <a
        href={getExperimentConsoleUrl(experiment.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.externalLink}
      >
        Open in Statsig
        <svg className={styles.externalLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {!isDisabled && (
        <button
          type="button"
          onClick={onUnlink}
          className={styles.unlinkButton}
        >
          Unlink
        </button>
      )}
    </div>
  </div>
);
