module.exports = {
    t4version: '7.4', //you'll have to config this for your environment
    components: ['./components/libs/bottle.js',
				'./components/javadependencies.js',
				'./components/dependencyinject.js',
                './components/base.js',
				'./components/console.js',
                './components/sitemanager.js',
                './components/brokerUtils.js',
                './components/elementInfo.js',
                './components/getSectionInfo.js',
                './components/media.js',
                './components/security.js'
    ],
    outputDir: './T4Utils/',
    isProduction: (process.env.NODE_ENV === 'production'), //From Windows command line:SET NODE_ENV=production. MAC: EXPORT NODE_ENV=production
    banner: ['/**',
            ' * <%= package.name %> - <%= package.description %>',
            ' * @version v<%= package.version %>',
            ' * @link <%= package.repository.url %>',
            ' * @author <%= package.author %>',
            ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.',
            ' * Built: ' + new Date() + '.',
            ' */',
            ''
    ].join('\n')
};
