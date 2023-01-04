import { container as container01 } from './mostly-adequate/01-what-ever-are-we-doing';

const section_logger = (section_number: string, section_name: string) => {
  console.log(`===== logging for section ${section_number}: ${section_name}`);
  return (...value: any[]) => console.log(section_number, ...value);
};

container01(section_logger('01', 'What Ever Are We Doing?'));
