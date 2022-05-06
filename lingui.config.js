module.exports = {
    catalogs: [
        {
            path: '<rootDir>/locale/{locale}',
            include: ['<rootDir>/src'],
            exclude: ['**/node_modules/**'],
        },
    ],
    compileNamespace: 'cjs',
    extractBabelOptions: {},
    fallbackLocales: {},
    format: 'po',
    locales: [
        'en',
        // 'ja',
        // 'zh-CN',
    ],
    sourceLocale: 'en',
    orderBy: 'messageId',
    pseudoLocale: '',
    rootDir: '.',
    runtimeConfigModule: ['@lingui/core', 'i18n'],
}
