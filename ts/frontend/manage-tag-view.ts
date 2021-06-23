const manage_tag_table_input = document.querySelector('#manage-tag-input') as HTMLInputElement

const manage_tag_view_table_body = document.querySelector('#manage-tag-table-body') as HTMLTableElement
//@ts-ignore
manage_tag_table_input ? manage_tag_table_input.onkeyup = () => filterTable(manage_tag_view_table_body, manage_tag_table_input) : console.log('manage_tag_view_table_body is null')

