import { container } from './mostly-adequate/08-tupperware';

const section_logger = (section_string: string) => {
  console.log(`===== logging for section: ${section_string}`);
  return (value: any) => console.log(section_string, value);
};

container(section_logger('08'));
