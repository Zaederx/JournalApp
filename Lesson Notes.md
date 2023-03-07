# Things learnt during the making of this project

## forEach loops in javascript are not ASYNC AWAIT aware
You end up getting unpredicatable behaviour when you use promises inside of forEach loops. Use for loops instead.