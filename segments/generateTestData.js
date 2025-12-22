// 生成测试数据的脚本
const fs = require('fs');
const path = require('path');

// 模拟 localStorage
class LocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// 设置全局 localStorage
global.localStorage = new LocalStorage();

// 读取并执行生成测试数据的函数
const testDataGeneratorPath = path.join(__dirname, 'src/utils/testDataGenerator.ts');

// 由于我们不能直接在 Node.js 中运行 TypeScript，所以我们需要创建一个简化的版本来生成数据

// 简化的 generateTestData 函数
function generateTestData() {
  const accounts = [];
  const contacts = [];
  
  // 生成 20 个账户
  for (let i = 1; i <= 20; i++) {
    const account = {
      id: `account_${i}`,
      name: `Test Company ${i}`,
      industrycode: 'Technology',
      accountcategorycode: 'Medium Business',
      accountnumber: `ACCT-${i.toString().padStart(5, '0')}`,
      telephone1: `555-000-${i.toString().padStart(4, '0')}`,
      websiteurl: `https://www.testcompany${i}.com`,
      address1_city: 'New York',
      address1_country: 'United States',
      creditlimit: 100000 + i * 10000
    };
    accounts.push(account);
  }
  
  // 生成 40 个联系人（每个账户 2 个）
  for (let i = 1; i <= 20; i++) {
    for (let j = 1; j <= 2; j++) {
      const contact = {
        id: `contact_${(i-1)*2 + j}`,
        firstname: `Contact${i}`,
        lastname: `Person${j}`,
        jobtitle: `Job Title ${(i-1)*2 + j}`,
        parentcustomerid: `account_${i}`,
        department: 'Sales',
        telephone1: `555-100-${((i-1)*2 + j).toString().padStart(4, '0')}`,
        mobilephone: `555-200-${((i-1)*2 + j).toString().padStart(4, '0')}`,
        emailaddress1: `contact${i}person${j}@testcompany${i}.com`,
        address1_line1: `${100 + (i-1)*2 + j} Main St`
      };
      contacts.push(contact);
    }
  }
  
  // 保存到 localStorage
  localStorage.setItem('accounts', JSON.stringify(accounts));
  localStorage.setItem('contacts', JSON.stringify(contacts));
  
  console.log(`Generated ${accounts.length} accounts and ${contacts.length} contacts.`);
  console.log('Accounts:', accounts);
  console.log('Contacts:', contacts);
}

// 运行生成数据的函数
generateTestData();
