#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# 真实NFT图片URL列表
nft_images = [
    "https://img-oset.hellobn.com/v1/asset_preview/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
    "https://img-oset.hellobn.com/v1/asset_preview/0xed5af388653567af2f388e6224dc7c4b3241c544/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
    "https://img-oset.hellobn.com/v1/asset_preview/0x23581767a106ae21c074b2276d25e5c3e136a68b/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
    "https://img-oset.hellobn.com/v1/asset_preview/0x4a5112a8939c9728339b844d3550770a92374db4/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
    "https://img-oset.hellobn.com/v1/asset_preview/0x5180db8F5c931aaE63c74266b211F580155ecac8/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
    "https://img-oset.hellobn.com/v1/asset_preview/0x60e4d786628fea6478f785a6d7e704777c86a7c6/1/0/eyJwcmV2aWV3Ijp7ImZvcm1hdCI6ImpwZyIsImJhY2tncm91bmQiOiIjZmZmZmZmIn19.jpg",
]

# NFT名称
nft_names = [
    "Bored Ape Yacht Club #1",
    "Azuki #88",
    "Moonbirds #256",
    "CloneX #512",
    "Doodles #999",
    "Mutant Ape #777"
]

# 创作者
creators = [
    "Yuga Labs",
    "ARTIST",
    "Proof",
    "RTFKT",
    "Doodles",
    "Yuga Labs"
]

# 读取文件
with open('市场.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换所有 image-placeholder 为真实图片
pattern = r'<div class="image-placeholder[^"]*"></div>'

def replace_nft(match):
    idx = int(match.group(1))
    if idx < len(nft_images):
        return f'<img src="{nft_images[idx]}" alt="{nft_names[idx]}">'
    return match.group(0)

# 先替换占位符
count = 0
def get_next_image(m):
    global count
    idx = count % len(nft_images)
    count += 1
    return f'<img src="{nft_images[idx]}" alt="{nft_names[idx]}">'

content = re.sub(pattern, get_next_image, content)

# 替换价格（从人民币改为USDT）
content = re.sub(r'<span class="price-value">¥ ([\d,]+)</span>',
                 lambda m: f'<span class="price-value">{m.group(1)} USDT</span>',
                 content)

# 替换NFT名称
name_pattern = r'<div class="nft-title">([^<]+)</div>'
name_counter = 0
def replace_name(m):
    global name_counter
    idx = name_counter % len(nft_names)
    name_counter += 1
    return f'<div class="nft-title">{nft_names[idx]}</div>'

content = re.sub(name_pattern, replace_name, content, count=len(nft_names))

# 替换创作者
creator_pattern = r'<span>ArtMaster</span>|<span>CyberArtist</span>|<span>NatureLover</span>|<span>AbstractX</span>|<span>WarriorX</span>'
creator_counter = 0
def replace_creator(m):
    global creator_counter
    idx = creator_counter % len(creators)
    creator_counter += 1
    return f'<span>{creators[idx]}</span>'

content = re.sub(creator_pattern, replace_creator, content)

# 写回文件
with open('市场.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("市场.html 修改完成！")
