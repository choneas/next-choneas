# Next Choneas
Choneas 的个人网站

## Features
- 文章内容通过 Notion 管理
- 通过 React Notion X 进行渲染文章
- 用户界面国际化支持

## Warning
这个项目处于制作与更新的状态，并且因国际化原因需要对不同的标签进行翻译，这些标签因人而异，故不推荐用于自己的网站，仅供参考。

他人可通过这个 Notion 页面在 Notion 中访问，而不仅仅是这个站点，如果将其设置为私密，即使通过 Cookie 访问也会导致图片无法加载。

## Setup

### Notion

1. 创建一个 Notion 页面，包含一个数据库，并且将其公开（发布）
2. 在数据库创建以下属性

| Type | Name | Description |
| ---- | ---- | ---- |
| String | Slug | 自定义文章的标识 |
| ID | ID | 文章的唯一数字 ID |
| String | Descritpion | (SEO)文章的摘要 |
| Multiselect | Category | 文章的分类 |
| Author | Author | 文章作者（Notion用户）|
| Created Time | Created | 创建时间 |
| Last Edit Time | Last Edit | 修改时间 |

### Site

1. 配置 `.env` 文件
2. 根据需求自定义 `locales` `data` 以及 `Tracking ID`

# Thanks to
- [shenlu89/shenlu.me](https://github.com/shenlu89/shenlu.me) *启发了我很多 Next.js 项目的规范*
- [tangly1024/NotionNext](https://github.com/tangly1024/NotionNext) *发现了 React Notion X 项目，并且对其配置、优化给予许多参考*