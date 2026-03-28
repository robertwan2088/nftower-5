#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
腾讯云API配置DNS记录
"""

import requests
import json

# 腾讯云API配置
SECRET_ID = "AKIDEUYTFpBMPOEvQny0thJo7INMBrNvNwKa"
SECRET_KEY = "AEJF3Hh2KTTJJzZwDMM960seLwbFleXI"
REGION = "ap-guangzhou"
DOMAIN = "nft8888.site"
SUBDOMAIN = "www"  # 如果需要www子域名
RECORD_TYPE = "CNAME"
RECORD_VALUE = "robertwan2088.github.io"  # GitHub Pages地址

# API端点
ENDPOINT = f"https://dns.{REGION}.tencentcloudapi.com"

def get_headers():
    """获取API请求头"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"TC3-HMAC-SHA256 {SECRET_ID}",
        "Host": f"dns.{REGION}.tencentcloudapi.com"
    }
    return headers

def login():
    """登录腾讯云"""
    url = f"{ENDPOINT}/v2/login"

    headers = get_headers()

    payload = {
        "secret_id": SECRET_ID,
        "secret_key": SECRET_KEY
    }

    print("正在登录腾讯云...")
    response = requests.post(url, headers=headers, json=payload, timeout=10)

    if response.status_code == 200:
        print("✅ 登录成功")
        return response.json()
    else:
        print(f"❌ 登录失败: {response.status_code}")
        print(f"响应: {response.text}")
        return None

def describe_dns_records(domain):
    """查询域名DNS记录"""
    url = f"{ENDPOINT}/v2/RecordList"

    headers = get_headers()

    params = {
        "domain": domain
    "RecordType": "CNAME"
        # 获取CNAME记录
    }

    print(f"\n正在查询 {domain} 的DNS记录...")
    response = requests.get(url, headers=headers, params=params, timeout=10)

    if response.status_code == 200:
        result = response.json()
        print(f"✅ 查询成功")
        return result
    else:
        print(f"❌ 查询失败: {response.status_code}")
        print(f"响应: {response.text}")
        return None

def create_dns_record(domain, subdomain, record_type, value):
    """创建DNS记录"""
    url = f"{ENDPOINT}/v2/RecordCreate"

    headers = get_headers()

    payload = {
        "domain": domain,
        "subdomain": subdomain,
        "recordType": record_type,
        "recordLine": 1,
        "value": value,
        "ttl": 600
    }

    print(f"\n正在创建DNS记录...")
    print(f"域名: {domain}")
    print(f"子域名: {subdomain}")
    print(f"类型: {record_type}")
    print(f"值: {value}")

    response = requests.post(url, headers=headers, json=payload, timeout=10)

    if response.status_code == 200:
        print("DNS记录创建成功")
        return response.json()
    else:
        print(f"DNS记录创建失败: {response.status_code}")
        print(f"响应: {response.text}")
        return None

def main():
    """主函数"""
    print("=" * 60)
    print("腾讯云DNS配置")
    print("=" * 60)
    print()

    # 查询现有DNS记录
    dns_result = describe_dns_records(DOMAIN)

    if dns_result and 'Response' in dns_result:
        records = dns_result['Response']['RecordList']
        print(f"\n现有DNS记录数量: {len(records)}")

        for record in records:
            print(f"\n记录ID: {record.get('RecordId')}")
            print(f"子域名: {record.get('Subdomain')}")
            print(f"类型: {record.get('Type')}")
            print(f"值: {record.get('Value')}")

    # 创建新的DNS记录
    print("\n" + "=" * 60)
    print("开始创建新的DNS记录")
    print("=" * 60)

    # 创建根域名的CNAME记录
    result = create_dns_record(DOMAIN, "", RECORD_TYPE, RECORD_VALUE)

    if result:
        print("\nDNS记录创建完成！")
        print("\nDNS生效时间：通常需要10分钟到24小时")

        print("\n请验证DNS记录：")
        print(f"1. 使用命令: nslookup {DOMAIN}")
        print(f"2. 访问: https://dnschecker.org/#A/{DOMAIN}")
        print(f"3. 等待DNS生效后，访问: http://{DOMAIN}")
    else:
        print("\nDNS记录创建失败，请检查API配置")

if __name__ == '__main__':
    main()
