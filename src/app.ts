import { container as container01 } from './mostly-adequate/01-what-ever-are-we-doing';
import { container as container04 } from './mostly-adequate/04-currying';
import { container as container05 } from './mostly-adequate/05-composing';
import { container as container06 } from './mostly-adequate/06-flickr-app';
import { container as container08 } from './mostly-adequate/08-tupperware';

import { section_logger } from './utils';

container01(section_logger('01', 'What Ever Are We Doing?'));
container04(section_logger('04', 'Currying'));
container05(section_logger('05', 'Composing'));
container06(section_logger('06', 'Example Application'));
container08(section_logger('08', 'Tupperware'));
