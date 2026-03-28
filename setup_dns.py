#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
腾讯云DNS配置脚本
"""

import requests
import json

# 腾讯云API配置
SECRET_ID = "AKIDEUYTFpBMPOEvQny0thJo7INMBrNvNwKa"
SECRET_KEY = "AEJF3Hh2KTTJJzZwDMM960seLwbFleXI"
REGION = "ap-guangzhou"
DOMAIN = "nft8888.site"
SUBDOMAIN = ""
RECORD_TYPE = "CNAME"
RECORD_VALUE = "robertwan2088.github.io"

ENDPOINT = f"https://dns.{REGION}.tencentcloudapi.com"

def get_headers():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"TC3-HMAC-SHA256 {SECRET_ID}",
        "Host": f"dns.{REGION}.tencentcloudapi.com"
    }
    return headers

def login():
    url = f"{ENDPOINT}/v2/login"
    headers = get_headers()
    payload = {
        "secret_id": SECRET_ID,
        "secret_key": SECRET_KEY
    }
    
    print("Logging in to Tencent Cloud...")
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    
    if response.status_code == 200:
        print("Login successful")
        return response.json()
    else:
        print(f"Login failed: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def describe_dns_records(domain):
    url = f"{ENDPOINT}/v2/RecordList"
    headers = get_headers()
    params = {
        "domain": domain,
        "RecordType": RECORD_TYPE
    }
    
    print(f"\nQuerying DNS records for {domain}...")
    response = requests.get(url, headers=headers, params=params, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Query successful")
        return result
    else:
        print(f"Query failed: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def create_dns_record(domain, subdomain, record_type, value):
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
    
    print(f"\nCreating DNS record...")
    print(f"Domain: {domain}")
    print(f"Subdomain: {subdomain}")
    print(f"Type: {record_type}")
    print(f"Value: {value}")

    response = requests.post(url, headers=headers, json=payload, timeout=10)
    
    if response.status_code == 200:
        print("DNS record created successfully")
        return response.json()
    else:
        print(f"Failed to create DNS record: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def main():
    print("=" * 60)
    print("Tencent Cloud DNS Configuration")
    print("=" * 60)
    print()

    # Log in
    login_result = login()
    if not login_result:
        return

    # Query existing DNS records
    dns_result = describe_dns_records(DOMAIN)

    if dns_result:
        print("\nFull API Response:")
        print(json.dumps(dns_result, indent=2))

        # Try to parse the response
        try:
            if 'Response' in dns_result:
                records = dns_result['Response']['RecordList']
                print(f"\nExisting DNS records: {len(records)}")

                for record in records:
                    print(f"  Record ID: {record.get('RecordId')}")
                    print(f"  Subdomain: {record.get('Subdomain')}")
                    print(f"  Type: {record.get('Type')}")
                    print(f"  Value: {record.get('Value')}")
            else:
                print("\nUnexpected response structure. Please check the full response above.")
        except Exception as e:
            print(f"\nError parsing response: {e}")

    # Create new DNS record
    print("\n" + "=" * 60)
    print("Creating new DNS record")
    print("=" * 60)

    result = create_dns_record(DOMAIN, SUBDOMAIN, RECORD_TYPE, RECORD_VALUE)

    if result:
        print("\nDNS record creation completed!")
        print("\nPlease verify:")
        print(f"1. Use command: nslookup {DOMAIN}")
        print(f"2. Visit: http://{DOMAIN}")
        print(f"3. Wait for DNS propagation (10 minutes to 24 hours)")
    else:
        print("\nDNS record creation failed")

if __name__ == '__main__':
    main()
