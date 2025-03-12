mkdir ./dist/esm

cat >dist/esm/index.js <<!EOF
import cjsModule from '../index.js';
export const generate = cjsModule.generate;
export const from = cjsModule.from;
export const fromJwk = cjsModule.fromJwk;
export const toJwk = cjsModule.toJwk;
!EOF

cat >dist/esm/package.json <<!EOF
{
  "type": "module"
}
!EOF
