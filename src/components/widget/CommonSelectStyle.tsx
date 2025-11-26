export const CommonSelectStyle = ({ themeName }: { themeName: string }) => {
  return {
    menu: (base: any) => ({
      ...base,
      boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",
      position: "absolute",
      zIndex: 9999,
      width: "100%",
      color: themeName === "dark" ? "gray" : "black",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
};
