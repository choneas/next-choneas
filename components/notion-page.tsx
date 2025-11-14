"use client"

import * as React from 'react'
import { Image, Link } from '@heroui/react'
import { type ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'
import { useTheme } from 'next-themes'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'

const NotionPage = ({ recordMap, type }: { recordMap: ExtendedRecordMap, type?: "tweet-preview" | "tweet-details" }) => {
    const { resolvedTheme } = useTheme();

    const Code = dynamic(() =>
        import('react-notion-x/build/third-party/code').then((m) => m.Code),
        {
            ssr: false
        }
    )
    const Collection = dynamic(() =>
        import('react-notion-x/build/third-party/collection').then(
            (m) => m.Collection
        ),
        {
            ssr: false
        }
    )
    const Equation = dynamic(() =>
        import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
    )
    const Pdf = dynamic(
        () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
        {
            ssr: false
        }
    )
    const Modal = dynamic(
        () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
        {
            ssr: false
        }
    )

    return (
        <>
            <NotionRenderer
                recordMap={recordMap}
                darkMode={resolvedTheme === 'dark'}
                fullPage={false}
                components={{
                    Code,
                    Collection,
                    Equation,
                    Modal,
                    Pdf,
                    nextImage: Image,
                    nextLink: Link
                }}
            />
            <NotionTableReplacer />
            <style jsx global>{`
                .notion {
                    font-family: var(--font-serif);
                    --notion-max-width: 720px;
                    font-size: 1.125rem;
                    line-height: 1.75rem;
                    color: var(--foreground) !important;
                }
                // .notion *::selection {
                //     background-color: var(--heroui-primary) !important;
                //     color: var(--heroui-foreground) !important;
                // }
                .notion-page {
                    width: 100%;
                    padding-left: 0%;
                    padding-right: 0%;
                }
                .notion-collection-page-properties {
                    display: none;
                }
                ${type === "tweet-preview" ? `
                .notion-asset-wrapper-image {
                    display: none;
                }` : ""}
                
            `}</style>
        </>
    )
}

const NotionTableReplacer = () => {
    React.useEffect(() => {
        if (typeof document === 'undefined') return;
        const notionTables = document.querySelectorAll('.notion-simple-table');
        notionTables.forEach((notionTable, tableIndex) => {
            if ((notionTable as HTMLElement).dataset.herouiReplaced) return;
            const rows = Array.from(notionTable.querySelectorAll('tr'));
            if (rows.length === 0) return;
            const headerRow = rows[0];
            const dataRows = rows.slice(1);
            const headerCells = Array.from(headerRow.querySelectorAll('td'));
            const columns = headerCells.map((td, index) => ({
                key: `col_${index}`,
                label: <>{Array.from(td.querySelectorAll('.notion-simple-table-cell')).map((cell, i) => <span key={i} dangerouslySetInnerHTML={{ __html: cell.innerHTML }} />)}</>
            }));
            const items = dataRows.map((row, rowIndex) => {
                const cells = Array.from(row.querySelectorAll('td'));
                const rowData: { [key: string]: React.ReactNode; id: string } = { id: `row_${rowIndex}` };
                columns.forEach((col, cellIndex) => {
                    const cell = cells[cellIndex];
                    if (!cell) return;
                    const notionCellDivs = cell.querySelectorAll('.notion-simple-table-cell');
                    rowData[col.key] = (
                        <>
                            {Array.from(notionCellDivs).map((div, i) => (
                                <span key={i} dangerouslySetInnerHTML={{ __html: div.innerHTML }} />
                            ))}
                        </>
                    );
                });
                return rowData;
            });
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'my-4 w-full outline-(--outline)';
            tableWrapper.setAttribute('data-heroui-table', 'true');
            notionTable.parentNode?.insertBefore(tableWrapper, notionTable.nextSibling);
            import('@heroui/react').then(({ Table, TableHeader, TableBody, TableColumn, TableRow, TableCell }) => {
                import('react-dom/client').then(({ createRoot }) => {
                    const root = createRoot(tableWrapper);
                    root.render(
                        <Table aria-label={`Notion Table ${tableIndex + 1}`}>
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.key} className='bg-content2'>{column.label}</TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={items}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((col) => (
                                            <TableCell key={col.key}>{item[col.key]}</TableCell>
                                        ))}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    );
                    (notionTable as HTMLElement).style.display = 'none';
                    (notionTable as HTMLElement).dataset.herouiReplaced = 'true';
                });
            });
        });
    }, []);
    return null;
};

export default NotionPage;