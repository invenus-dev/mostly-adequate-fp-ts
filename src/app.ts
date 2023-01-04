import { container as container01 } from './mostly-adequate/01-what-ever-are-we-doing';
import { container as container04 } from './mostly-adequate/04-currying';
import { section_logger } from './utils';

container01(section_logger('01', 'What Ever Are We Doing?'));
container04(section_logger('04', 'Currying'));
