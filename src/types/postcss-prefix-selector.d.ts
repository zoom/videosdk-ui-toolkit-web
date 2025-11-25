declare module "postcss-prefix-selector" {
  import { Plugin } from "postcss";

  interface Options {
    prefix: string;
    exclude?: Array<string | RegExp>;
  }

  function postcssPrefixSelector(options: Options): Plugin;
  export = postcssPrefixSelector;
}
