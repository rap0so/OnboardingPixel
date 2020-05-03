const { exec } = require('child_process');

const throwError = error => {
  throw new Error(error);
};

const executeOnBash = (command, callback = () => {}) => {
  exec(command, (error, stdout) => {
    if (error) return throwError(error);

    return callback(stdout);
  });
};

const prePushMaster = stdout => {
  if (stdout.trim().toString() !== 'master') return;
  // eslint-disable-next-line no-console
  console.log('Estamos na master, preparando nova versão');
  executeOnBash('npm version patch', result => {
    // eslint-disable-next-line no-console
    console.log('Versão atualizada com sucesso:', result);
    executeOnBash('git push --quiet --no-verify');
  });
};

executeOnBash('git rev-parse --abbrev-ref HEAD', prePushMaster);
