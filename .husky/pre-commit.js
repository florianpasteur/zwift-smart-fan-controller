const fs = require('fs');

const readMeFile = "README.md"

let readMeFileContent = fs.existsSync(readMeFile) ? fs.readFileSync(readMeFile).toString() : "";


const blockMatcher = /<!-- command-documentation -->((.|\n)*)<!-- end-command-documentation -->/gm;

function blockContent() {
    const content = process.argv[2];
    return `<!-- command-documentation -->
\`\`\`
> zwift-smart-fan-controller --help
\n${content}\n 
\`\`\`
<!-- end-command-documentation -->`;
}

const newTableOfContent = blockContent();

if (readMeFileContent.match(blockMatcher)) {
    readMeFileContent = readMeFileContent.replace(blockMatcher, newTableOfContent)
} else {
    readMeFileContent = readMeFileContent + "\n" + newTableOfContent
}


fs.writeFileSync(readMeFile, readMeFileContent);
