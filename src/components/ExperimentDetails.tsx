import type { FC } from "react";
import { getExperimentConsoleUrl } from "../api/statsig.ts";
import { CheckIcon } from "../icons/CheckIcon.tsx";
import { ExternalLinkIcon } from "../icons/ExternalLinkIcon.tsx";
import { TrophyIcon } from "../icons/TrophyIcon.tsx";
import type { StatsigExperiment } from "../types/index.ts";
import styles from "./ExperimentDetails.module.css";
import { ExperimentVariants } from "./ExperimentVariants.tsx";
import { StatusBadge } from "./StatusBadge.tsx";

type ExperimentDetailsProps = {
  readonly experiment: StatsigExperiment;
  readonly onUnlink: () => void;
  readonly onConclude?: () => void;
  readonly isDisabled: boolean;
  readonly isCleanupEnabled: boolean;
};

export const ExperimentDetails: FC<ExperimentDetailsProps> = ({
  experiment,
  onUnlink,
  onConclude,
  isDisabled,
  isCleanupEnabled,
}) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <CheckIcon className={styles.checkIcon} />
        <span className={styles.title}>{experiment.name}</span>
      </div>
      <StatusBadge status={experiment.status} />
    </div>

    {experiment.hypothesis ? <p className={styles.hypothesis}>{experiment.hypothesis}</p> : null}

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
          {experiment.status === "active" && onConclude && isCleanupEnabled ? (
            <button type="button" onClick={onConclude} className={styles.concludeButton}>
              <TrophyIcon className={styles.concludeIcon} />
              Conclude
            </button>
          ) : null}
          {experiment.status === "active" && !isCleanupEnabled && (
            <span
              className={styles.concludeDisabled}
              title="Cleanup is not configured. Check server logs for details."
            >
              <TrophyIcon className={styles.concludeIconDisabled} />
              Conclude
            </span>
          )}
          {experiment.status !== "active" && (
            <span
              className={styles.concludeDisabled}
              title="Only active experiments can be concluded"
            >
              <TrophyIcon className={styles.concludeIconDisabled} />
              Conclude
            </span>
          )}
          <button type="button" onClick={onUnlink} className={styles.unlinkButton}>
            Unlink
          </button>
        </div>
      )}
    </div>
  </div>
);
