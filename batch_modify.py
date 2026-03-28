#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NFTOwer-5网站批量修改脚本
"""

from pathlib import Path

# 项目目录
PROJECT_DIR = Path("/Users/elonmusk/Desktop/nftower-5")

# 文本替换映射
REPLACEMENTS = {
    # 项目名称
    'NFT7': 'NFTOwer-5',
    'NFT 平台': 'NFTOwer-5 平台',
    'NFT 平台 - 探索数字艺术': 'NFTOwer-5 平台 - 探索数字艺术',

    # 导航栏
    '连接钱包': 'rob***@gmail.com',

    # 首页
    '探索独特的数字艺术': '在全球顶尖的web3 NFT市场搜索、发现并赚取丰厚回报',
    '发现、收集和交易独特的 NFT 藏品': '加入数百万用户的行列，体验革命性的NFT交易平台',
    '开始探索': '立即开始',

    # 其他页面
    'NFT 平台': 'NFTOwer-5 平台',
}

def modify_html_file(file_path):
    """修改单个HTML文件"""
    print(f"  修改: {file_path.name}")

    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已经修改过
    if 'NFTOwer-5' in content:
        print(f"    跳过（已修改）")
        return False

    # 执行替换
    modified = False
    for old_text, new_text in REPLACEMENTS.items():
        if old_text in content:
            content = content.replace(old_text, new_text)
            modified = True

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return modified

def main():
    """主函数"""
    print("=" * 60)
    print("批量修改NFTOwer-5网站文件")
    print("=" * 60)
    print()

    # 获取所有HTML文件
    html_files = list(PROJECT_DIR.glob('*.html'))

    if not html_files:
        print("未找到HTML文件")
        return

    print(f"找到 {len(html_files)} 个HTML文件\n")

    # 修改每个文件
    modified_count = 0
    for html_file in html_files:
        if modify_html_file(html_file):
            modified_count += 1

    print()
    print("=" * 60)
    print(f"✅ 修改完成！共修改 {modified_count} 个文件")
    print("=" * 60)
    print()
    print("下一步：推送到GitHub")

if __name__ == '__main__':
    main()
