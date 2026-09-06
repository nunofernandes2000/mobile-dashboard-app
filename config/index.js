import dev from './dev.js';
import testjm from './testjm.js';
import testrc from './testrc.js';
import nunolaptop from './nunolaptop.js';
import prod from './prod.js';

const ENV = process.env.EXPO_PUBLIC_ENV || 'dev';

const CONFIG = {
    dev,
    testjm,
    testrc,
    nunolaptop,
    prod,
    production: prod
};

export default CONFIG[ENV] || CONFIG.dev;
