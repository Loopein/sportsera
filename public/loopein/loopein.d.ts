declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "./loopein.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.png" {
  const content: string | { src: string; height?: number; width?: number };
  export default content;
}

