module.exports = {
    title: 'Devbit IoT-Lab',
    description: 'Devbit IoT-Lab',
    dest: 'dist',
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
      ],
      repo: 'https://github.com/vives-devbit/iot-lab',
      docsDir: 'src',
      docsBranch: 'master',
      smoothScroll: true
    },
    markdown: {
      lineNumbers: true,
    },
    serviceWorker: true,
    plugins: [
      ['vuepress-plugin-zooming', {
        // selector for images that you want to be zoomable
        // default: '.content img'
        selector: 'img',
  
        // make images zoomable with delay after entering a page
        // default: 500
        // delay: 1000,
  
        // options of zooming
        // default: {}
        options: {
          bgColor: 'black',
          zIndex: 10000,
        },
      }],
    ],
  }