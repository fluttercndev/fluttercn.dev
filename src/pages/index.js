/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

const activitys = [
  {
    title: <>360互联网技术训练营第17期——Flutter 开发者沙龙</>,
    imageUrl: 'https://p3.ssl.qhimg.com/t01ed47f941f8c2c3e4.jpg',
    link: 'http://www.huodongxing.com/event/5500608998700',
    description: (
      <>
        在移动端，受成本和效率的驱使，跨平台一站式开发慢慢成为一个趋势。Flutter 是 Google 开发的一套全新的跨平台、开源 UI 框架，支持包括 iOS、Android 等各种平台应用开发，近两年来以其多平台的兼容能力，受到广大开发者的关注和青睐。本次活动我们邀请了业界多位专家从 Flutter 内部技术细节实现原理、Flutter 使用方法及应用实践等多方面探索 Flutter 技术。
      </>
    )
  }
]

const features = [
  {
    title: <>Easy to Use</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: <>Focus on What Matters</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: <>Powered by React</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Flutter 爱好者社区，我们致力了 Flutter 的学习和交流">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={withBaseUrl('https://flutter-io.cn/docs')}>
              中文文档 Beta
            </Link>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={withBaseUrl('https://flutter.dev/docs')}>
              官方英文文档
            </Link>
          </div>
        </div>
      </header>
      <main>
        {activitys && activitys.length && (
          <section className={styles.activitys}>
            <div className="container">
              <h2 className="title">
                社区活动
              </h2>
              <div className="row">
                {activitys.map(({imageUrl, title, description, link}, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--4', styles.activity)}>
                    <a href={link} target="_blank">
                      {imageUrl && (
                        <div className="text--center">
                          <img
                            className={styles.activityImage}
                            src={withBaseUrl(imageUrl)}
                            alt={title}
                          />
                        </div>
                      )}
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
