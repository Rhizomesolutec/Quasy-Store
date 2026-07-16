export const SHARED_SPIDER_IMAGES = {
  one: "/images/spider-1.jpg",
  two: "/images/spider-2.jpg",
  three: "/images/spider-3.jpg",
} as const;

export const SHARED_SPIDER_SET = [
  SHARED_SPIDER_IMAGES.one,
  SHARED_SPIDER_IMAGES.two,
  SHARED_SPIDER_IMAGES.three,
] as const;
