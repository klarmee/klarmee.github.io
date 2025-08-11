from bs4 import BeautifulSoup
import os

with open('index2.html', 'r') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Make image pages
for div in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4]:
    div_id = div.get('id')
    img_counter = 1
    for img in div.find_all('img'):
        img_src = os.path.basename(img['src'])
        img_base = os.path.splitext(img_src)[0]

        prev = ''
        next = ''
        if img_counter > 1:
            prev += f'<div><a href="{img_counter-1}.html">&lt;</a></div>'

        else: 
            prev += '<div>&ensp;</div>'
        if img_counter < len(div.find_all('img')):
            next += f'<div><a href="{img_counter+1}.html">&gt;</a></div>'
        else: 
            next += '<div>&ensp;</div>'


        new_page_html = f"""
        <html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Kevin Larmee {div_id} {img_counter}</title>
    <link rel="stylesheet" href="../css.css">
</head>

<body>
    <div class="landscape">
        <div>
            <a href="../">^</a>
        </div>
        {prev}
        <div>
            <img src="../hi/{img_src}" srcset="../avif/hi/{img_base}.avif">
        </div>
        {next}
    </div>
    <div class="portrait">
        <div>
            <a href="../">^</a>
        </div>
        {prev}
        <div>
            <img src="../hi/{img_src}" srcset="../avif/hi/{img_base}.avif">
        </div>
        {next}
    </div>
    <script src="../nav.js"></script>
</body>

</html>
        """

        os.makedirs(div_id, exist_ok=True)
        with open(os.path.join(div_id, f'{img_counter}.html'), 'w') as file:
            file.write(new_page_html)
        img_counter += 1
