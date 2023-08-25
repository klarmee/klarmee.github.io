import { drawingData } from './drawingData.js';
import base from './base.js';
import { useState, useEffect, useRef } from 'react';
export default function Edit() {
    const s = useRef(undefined);
    useEffect(() => {
        window.addEventListener('click', handleClick)
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('keydown', handleKeydown);
        }
        function select() { s.current.className = "border" }
        function deselect() { s.current.className = "" }
        function deselectAll() { Array.from(document.querySelectorAll('.border')).forEach((a) => a.className = '') }
        function handleClick(e) {
            if (e.shiftKey !== true && e.ctrlKey !== true) deselectAll()
            s.current = e.target
            if (s.current.classList.contains('border')) { deselect() }
            else if (e.shiftKey) shiftSelect(e)
            else select()
            navigator.clipboard.writeText(e.target.src.match(/00\/(.+)/)[1])
            e.preventDefault()
        }
        function shiftSelect(e) {
            var children = document.getElementById('contents').children
            var nodes = Array.prototype.slice.call(children)
            var initEl = nodes.indexOf(document.getElementsByClassName('border')[0])
            var nextEl = nodes.indexOf(e.target)
            console.log(e.shiftKey, initEl, nextEl);
            var indices = [initEl, nextEl]
            var min = Math.min(...indices)
            var max = Math.max(...indices)
            for (let i = min; i <= max; i++) {
                s.current = nodes[i]
                select()
            }
        }
        function handleKeydown(e) {
            var selected = document.getElementsByClassName('border')
            var next = selected ? selected[selected.length - 1].nextSibling : undefined
            var prev = selected ? selected[0].previousSibling : undefined
            if (e.key == 'Escape') {
                if (selected !== undefined) {
                    var divs = Array.from(document.querySelectorAll('#contents div'))
                    divs.forEach((div) => {
                        var children = Array.from(div.children)
                        children.forEach((child) => {
                            div.insertAdjacentElement('beforebegin', child)
                        })
                    })
                    divs.forEach((div) => div.remove())
                }
                deselectAll()
            }
            if (e.key == 'Enter' && selected.length > 1) {
                let div = document.createElement('div')
                if (next) next.insertAdjacentElement('beforebegin', div)
                else prev.insertAdjacentElement('afterend', div)
                Array.from(selected).forEach((el) => {
                    div.insertAdjacentElement('beforeend', el)
                })
                s.current = div
                deselectAll()
                select()
                console.log(prev, next, s.current);
            }

            if (e.key === 'r') {
                let num = 90
                if (selected[0].style.transform) num = parseInt(selected[0].style.transform.match(/\d+/)[0]) + 90
                const style = `transform:rotate(${num}deg)`
                selected[0].style = style
            } 
            if (e.key === 'b') {
                Array.from(selected).forEach((selected) => selected.src = selected.src.replace('200','800'))
            }
            if (e.key === 's') {
                Array.from(selected).forEach((selected) => selected.src = selected.src.replace('800','200'))
            }
            if (e.key === 'ArrowLeft' && prev) {
                if (e.ctrlKey) prev.insertAdjacentElement('beforebegin', s.current)
                else s.current = prev
                if (e.shiftKey !== true) deselectAll()
                select()
                e.preventDefault()
            }
            if (e.key === 'ArrowRight' && next) {
                if (e.ctrlKey) next.insertAdjacentElement('afterend', s.current)
                else s.current = next
                if (e.shiftKey !== true) deselectAll()
                select()
                e.preventDefault()
            }
            if (e.ctrlKey && e.key === 'ArrowUp') {
                s.current.parentNode.insertAdjacentElement('afterbegin', s.current)
                e.preventDefault()
            }
            if (e.ctrlKey && e.key === 'ArrowDown') {
                s.current.parentNode.insertAdjacentElement('beforeend', s.current)
                e.preventDefault()
            }
            let imgs = []
            Array.from(document.querySelectorAll('img')).forEach((img) => {
                imgs.push(`"${img.src.match(/00\/(.+)/)[1]}"`)
            })
            imgs = [...new Set(imgs)]
            navigator.clipboard.writeText('export const drawingData = [' + imgs + ']')
        }

    }, [s])

    return (
        <>
            shift select. enter creates div of selected elements. ctr up move to top. b makes bigger, s smaller. keydown copies drawingData.js. click copies src.
            <div id="contents">
                {drawingData.map((url, index) => {
                    let fullUrl = base.url + "200/" + url
                    return <img key={index} src={fullUrl} />
                })}
            </div>
        </>)
}