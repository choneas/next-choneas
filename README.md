# Next Choneas

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![React Notion X](https://img.shields.io/badge/React_Notion_X-API-orange?logo=notion)](https://github.com/NotionX/react-notion-x)
[![License](https://img.shields.io/github/license/choneas/next-choneas)](LICENSE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/choneas/next-choneas)

🚀 基于 Next.js + Notion + React Notion X 打造的极简、优雅、支持国际化的个人博客系统。

---

## ✨ 特性

- 📖 **内容管理**：文章内容通过 Notion 数据库集中管理。
- ⚡ **极速渲染**：基于 [React Notion X](https://github.com/NotionX/react-notion-x) 实现高性能页面渲染。
- 🌏 **多语言支持**：内置国际化，轻松切换多语言界面。
- 🎨 **极简美观**：使用 [HeroUI](https://heroui.com) + [TailwindCSS](https://tailwindcss.com) 作为用户界面样式。
- 🔒 **隐私友好**：支持通过配置 Token 访问 Notion 私有数据库。
- 🛠️ **易于定制**：自定义语言文本，主题颜色，评论区等。

---

## 🚀 Quick Start

1. **克隆项目**
   ```bash
   git clone https://github.com/choneas/next-choneas.git
   cd next-choneas
   ```

2. **安装依赖**
   ```bash
    bun install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 为 `.env`，并根据你的 Notion 集成信息填写相关字段。

4. **运行开发环境**
   ```bash
    bun dev
   ```

5. **访问本地站点**
   - 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## ⚙️ 配置 Notion

若将 Notion 页面设为私密，图片等资源可能无法正常加载。

在文章数据库中创建以下属性：

| 名称             | 类型             | 说明                     |
| ---------------- | ---------------- | ------------------------ |
| Title            | String           | 文章标题                 |
| ID               | ID               | 文章唯一数字 ID          |
| Slug             | String           | 自定义文章标识，详见下方 |
| Type             | Select           | 详见下方                 |
| Author           | Person           | 文章作者 (Notion用户)    |
| Description      | String           | 文章摘要 (SEO)           |
| Category         | Multiselect      | 文章分类                 |
| Created time     | Created time     | 创建时间                 |
| Last edited time | Last edited time | 修改时间                 |

### Type

分为 `Tweet` 和 `Article`。`Tweet` 表示动态，在首页中可见预览和查看详情，在目录不可见。`Article` 表示文章，在首页中可见摘要，在目录中可见。

### Slug

如果文章没有填写 `Slug` 那么评论系统将无法工作，动态可不填写。请确保每一个 `Slug` 都是 **唯一且不变** 的。

---

## 🛠️ 配置站点

### 环境变量

复制 [.env.example](./.env.example) 为 .env。

```bash
cp .env.example .env
```

**注意** 如果在 Vercel 上部署，你需要在对应项目的 Settings > Enviroment Variables 中上传你的 `.env` 文件，因为它们始终保持在本地。

#### NOTION_AUTH_TOKEN, NOTION_ACTIVE_USER

用于获取私人 Notion 数据库（未在 Notion 中发布的）信息。

请参阅 [Private Pages](https://github.com/NotionX/react-notion-x?tab=readme-ov-file#private-pages)

#### NOTION_ROOT_PAGE_ID

用于获取 Notion 数据库信息。

1. 复制包含文章数据库的 Notion 页面。例如在 Notion 中创建了一个 `My Website` 的页面，此页面包含上述的数据库，则复制 `My Website` 页面的链接

    ```url
    https://www.notion.so/acme/My-Website-github1com1choneas1next1minus1ch?pvs=4
    ```

2. 复制类似 `github1com1choneas1next1minus1ch` 的字段，填写到 `NOTION_ROOT_PAGE_ID` 中。

#### GA_ID

用于 Google Analytics。

请参阅 [Google Analytics](https://developers.google.com/analytics) 文档以获取更多信息。

#### Notion 代理配置（可选）

如果你在中国大陆访问 Notion API 速度较慢，可以启用代理服务来提升访问速度。

代理服务来源：[notionfaster.org](https://www.notionfaster.org/)

在 `.env` 文件中配置以下变量：

```bash
# 启用 Notion 代理（默认为 false）
ENABLE_NOTION_PROXY=true

# Notion API 代理域名
NOTION_PROXY_DOMAIN=154.40.44.47

# Notion S3 资源代理域名
NOTION_S3_PROXY_DOMAIN=101.32.183.34
```

**注意**：
- 代理服务仅建议在中国大陆网络环境下使用
- 如果代理服务不可用，系统会自动回退到直接访问
- 非中国大陆用户建议保持 `ENABLE_NOTION_PROXY=false`

### 评论区

1. 你需要先将本地仓库上传到自己的 Github 上，并设置为公开。然后参阅 [giscus](https://giscus.app/) 进行配置，

2. 最终你将得到一个`<script>`标签

    ```html
    <script src="https://giscus.app/client.js"
            data-repo="Choneas/next-choneas"
            data-repo-id="R_kgDOMwBwQw"
            data-category="Comments"
            data-category-id="DIC_kwDOMwBwQ84CmQty"
            ...
            async>
    </script>
    ```

3. 将对应的`data-repo`、`data-repo-id`、`data-category`、`data-category-id` 等字段填入 `.env` 文件中。

---

### 国际化

关于页、首页的信息等。

*规范化中...涉及 [middleware.ts](./middleware.ts), [locales](./locales/)*

### 数据

个人社交网站地址、项目和文章作者。

*规范化中... 涉及 [data](./data/)*

## 📦 部署

支持一键部署到 [Vercel](https://vercel.com/)：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/choneas/next-choneas)

---

## 🙏 致谢

- [shenlu89/shenlu.me](https://github.com/shenlu89/shenlu.me) — 启发了我许多 Next.js 项目的规范
- [tangly1024/NotionNext](https://github.com/tangly1024/NotionNext) — 发现 React Notion X 项目，并对配置优化提供了诸多参考

---

## 📄 License

Apache License 2.0 © [Choneas](https://github.com/choneas)