import { useQuery } from "@tanstack/react-query";
import { deliveryClient } from "./kontentClient.ts";
import type { ArticlePageType, LandingPageType, StatsigExperimentType } from "./models/index.ts";

export const useLandingPage = (codename: string) =>
  useQuery({
    queryKey: ["landingPage", codename],
    queryFn: async () =>
      deliveryClient
        .item<LandingPageType>(codename)
        .depthParameter(3)
        .toPromise()
        .then((response) => response.data.item),
  });

export const useArticlePage = (codename: string) =>
  useQuery({
    queryKey: ["articlePage", codename],
    queryFn: async () =>
      deliveryClient
        .item<ArticlePageType>(codename)
        .depthParameter(3)
        .toPromise()
        .then((response) => response.data.item),
  });

export const getLinkedItemsMap = <T extends StatsigExperimentType>(
  linkedItems: ReadonlyArray<T>,
): ReadonlyMap<string, T> => {
  return new Map(linkedItems.map((item) => [item.system.id, item]));
};
