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
            prev += f'<a href="{img_counter-1}.html"><</a>'
        else: 
            prev += '&ensp;'
        if img_counter < len(div.find_all('img')):
            next += f'<a href="{img_counter+1}.html">></a>'
        else: 
            next += '&ensp;'


        new_page_html = f"""
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Kevin Larmee {div_id} {img_counter}</title>
            <style>
                div a {{
                    width: 3em;
                    height: 3em;
                    text-decoration: none;
                    vertical-align: bottom;
                    line-height: 3em;
                    background: white;
                    font-weight: bold;
                }}
                img {{
                    max-width: 100vw;max-height: 100vh;width: auto;height: auto;
                }}
            </style>
        </head>
<body style="margin: 0;width: 100%;height: 100vh;"><div style="font-size: 3vh;display: flex;height: 100%;flex-direction: column;z-index: 1;position: absolute;width: 100%;"><div style="text-align: center;display: flex;width: 100%;"><a href="../" style="">^</a></div><div style="flex-grow: 2;"></div><div style="text-align: center;display: flex;width: 100%;justify-content: space-between;">{prev}{next}</div><script src="../nav.js"></script></div><div style="height: 100%;width: 100%;display: grid;place-items: center;"><img src="../hi/{img_src}" srcset="../avif/hi/{img_base}.avif"></div></body>
</html>
        """

        os.makedirs(div_id, exist_ok=True)
        with open(os.path.join(div_id, f'{img_counter}.html'), 'w') as file:
            file.write(new_page_html)
        img_counter += 1
