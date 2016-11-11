System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  map: {
    app: "./src",
    '@reactivex/rxjs':'https://cdn.rawgit.com/ReactiveX/RxJS/5.0.0-alpha.8/src' 
  },
  packages: {
    app: {
      main: './app.ts',
      defaultExtension: 'ts'
    },
    '@reactivex/rxjs': {
      main: 'Rx.ts',
      defaultExtension: 'ts'
    }
  }
});