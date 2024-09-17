export const getQ = (searchParams: { name: string | undefined | string[] }) => {
  const q =
    typeof searchParams.name === "string" ? searchParams.name : undefined;

  return q;
};
