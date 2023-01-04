export const section_logger = (
  section_number: string,
  section_name: string
) => {
  console.log(`===== logging for section ${section_number}: ${section_name}`);
  return (...value: any[]) => console.log(section_number, ...value);
};
