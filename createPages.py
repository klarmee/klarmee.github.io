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
            prev += f'<div><a id="previous" href="{img_counter-1}.html"> <svg viewBox="0 0 10 10" style="height:1em;width:1em;fill:currentColor;vertical-align:middle" aria-hidden="true"><path d="M9,4 L5,4 L5,2 L1,5 L5,8 L5,6 L9,6 Z" /></svg> Previous</a></div>'

        else: 
            prev += '<div></div>'
        if img_counter < len(div.find_all('img')):
            next += f'<div><a id="next" href="{img_counter+1}.html"><svg viewBox="0 0 10 10" style="height:1em;width:1em;fill:currentColor;vertical-align:middle" aria-hidden="true"><path d="M1,4 L5,4 L5,2 L9,5 L5,8 L5,6 L1,6 Z" /></svg> Next</a></div>'
        else: 
            next += '<div></div>'


        new_page_html = f"""
        <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kevin Larmee {div_id} {img_counter}</title>
    <link rel="stylesheet" href="../css.css">
</head>

<body>
    <div class="landscape">
        <div>
            <a href="../"><svg viewBox="0 0 10 10" style="height:1em;width:1em;fill:currentColor;vertical-align:middle" aria-hidden="true"><path d="M1,5 L5,1 L9,5 L8,5 L8,9 L2,9 L2,5 Z" /></svg> Home </a>
        </div>
        {prev}
        <div>
            <img src="../hi/{img_src}">
        </div>
        {next}
    </div>
    <div class="portrait">
        <div>
            <a href="../"><svg viewBox="0 0 10 10" style="height:1em;width:1em;fill:currentColor;vertical-align:middle" aria-hidden="true"><path d="M1,5 L5,1 L9,5 L8,5 L8,9 L2,9 L2,5 Z" /></svg> Home </a>
        </div>
        {prev}
        <div>
            <img src="../hi/{img_src}">
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
