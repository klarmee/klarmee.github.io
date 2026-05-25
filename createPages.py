from bs4 import BeautifulSoup
import os

with open('index2.html', 'r') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Make image pages
for div in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4]:
    div_id = div.get('id')
    img_counter = 1
    all_imgs = div.find_all('img') # Cache this to avoid re-running find_all
    total_imgs = len(all_imgs)

    for img in all_imgs:
        img_src = os.path.basename(img['src'])

        if img_counter > 1:
            prev = f'<a id="previous" href="{img_counter-1}.html">previous</a>'
        else: 
            prev = '<br/>'

        if img_counter < total_imgs:
            next = f'<a id="next" href="{img_counter+1}.html">next</a>'
        else: 
            next = '<br/>'

        # Single, clean HTML structure
        new_page_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kevin Larmee {div_id} {img_counter}</title>
    <link rel="stylesheet" href="../css.css">
</head>
<body>
    <div>
        <a href="../index.html">Kevin Larmee</a>
        <div id="image">
            <a href="../hi/{img_src}"><img src="../800/{img_src}"></a>
        </div>
        <div class="nav">
            {prev}
            {next}
        </div>
    </div>
    <script src="../nav.js"></script>
</body>
</html>"""

        os.makedirs(div_id, exist_ok=True)
        with open(os.path.join(div_id, f'{img_counter}.html'), 'w') as file:
            file.write(new_page_html)
        img_counter += 1