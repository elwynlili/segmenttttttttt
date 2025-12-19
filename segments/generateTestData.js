// 测试数据生成脚本
// 在浏览器控制台中执行此脚本以批量插入客户和联系人数据

// 行业选项
const industries = ['金融', '医疗', '制造', '零售', '科技', '教育', '政府', '其他'];

// 客户规模选项
const accountCategories = ['大型企业', '中型企业', '小型企业', '初创公司', '个体工商户'];

// 职位选项
const jobTitles = ['经理', '总监', '总裁', '副总裁', '分析师', '顾问', '工程师', '设计师'];

// 部门选项
const departments = ['销售', '市场', '财务', '人力资源', '技术', '产品', '运营', '客户服务'];

// 决策影响标签
const decisionTags = ['决策者', '影响者', '阻碍者', '支持者', '信息收集者'];

// 生成随机手机号码
const generatePhoneNumber = () => {
  const prefix = '13' + Math.floor(Math.random() * 9);
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return prefix + suffix;
};

// 生成随机邮箱
const generateEmail = (firstname, lastname, company) => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstname.toLowerCase()}.${lastname.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.${domain}`;
};

// 生成随机日期
const generateRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// 生成随机客户数据
const generateAccountData = (index) => {
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const category = accountCategories[Math.floor(Math.random() * accountCategories.length)];
  const companyName = `测试客户 ${index}`;
  
  return {
    name: companyName,
    industrycode: industry,
    accountcategorycode: category,
    accountnumber: `ACCT-${index.toString().padStart(5, '0')}`,
    telephone1: generatePhoneNumber(),
    websiteurl: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    address1_city: `城市${index % 10}`,
    address1_country: '中国',
    creditlimit: Math.floor(Math.random() * 1000000) + 100000
  };
};

// 生成随机联系人数据
const generateContactData = (accountId, index) => {
  const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
  const lastNames = ['明', '芳', '军', '华', '强', '敏', '磊', '静', '涛', '丽'];
  
  const firstname = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastname = lastNames[Math.floor(Math.random() * lastNames.length)];
  const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  const department = departments[Math.floor(Math.random() * departments.length)];
  const companyName = `测试客户 ${Math.floor(index / 5) + 1}`; // 每5个联系人对应一个客户
  
  return {
    firstname: firstname,
    lastname: lastname,
    jobtitle: jobTitle,
    parentcustomerid: accountId,
    department: department,
    telephone1: generatePhoneNumber(),
    mobilephone: generatePhoneNumber(),
    emailaddress1: generateEmail(firstname, lastname, companyName),
    msdyn_decisioninfluencetag: decisionTags[Math.floor(Math.random() * decisionTags.length)],
    msdyn_gdproptout: Math.random() > 0.8 // 20%的概率选择退出
  };
};

// 批量插入客户数据
const insertTestAccounts = (count = 100) => {
  const accountData = [];
  for (let i = 1; i <= count; i++) {
    const account = generateAccountData(i);
    // 使用项目中的addToStorage函数插入数据
    window.accountData = window.accountData || [];
    const timestamp = new Date().toISOString();
    const accountWithId = {
      ...account,
      id: `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    window.accountData.push(accountWithId);
  }
  localStorage.setItem('accounts', JSON.stringify(window.accountData));
  console.log(`成功插入 ${count} 条客户数据`);
  return window.accountData;
};

// 批量插入联系人数据
const insertTestContacts = (count = 100, accounts = []) => {
  // 如果没有提供客户数据，从localStorage获取
  if (accounts.length === 0) {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      accounts = JSON.parse(storedAccounts);
    } else {
      console.error('没有找到客户数据，请先插入客户数据');
      return;
    }
  }
  
  const contactData = [];
  for (let i = 1; i <= count; i++) {
    // 随机选择一个客户ID
    const accountIndex = Math.floor(Math.random() * accounts.length);
    const accountId = accounts[accountIndex].id;
    const contact = generateContactData(accountId, i);
    
    // 使用项目中的addToStorage函数插入数据
    window.contactData = window.contactData || [];
    const timestamp = new Date().toISOString();
    const contactWithId = {
      ...contact,
      id: `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    window.contactData.push(contactWithId);
  }
  localStorage.setItem('contacts', JSON.stringify(window.contactData));
  console.log(`成功插入 ${count} 条联系人数据`);
  return window.contactData;
};

// 清空现有数据
const clearAllData = () => {
  localStorage.removeItem('accounts');
  localStorage.removeItem('contacts');
  window.accountData = [];
  window.contactData = [];
  console.log('已清空所有客户和联系人数据');
};

// 执行完整的测试数据插入
const generateAllTestData = (accountCount = 100, contactCount = 100) => {
  console.log('开始生成测试数据...');
  clearAllData();
  const accounts = insertTestAccounts(accountCount);
  const contacts = insertTestContacts(contactCount, accounts);
  console.log('测试数据生成完成！');
  console.log(`共生成 ${accounts.length} 条客户数据和 ${contacts.length} 条联系人数据`);
  
  // 刷新页面以显示新数据
  location.reload();
};

// 将函数添加到window对象，以便在浏览器控制台中使用
window.generateAllTestData = generateAllTestData;
window.insertTestAccounts = insertTestAccounts;
window.insertTestContacts = insertTestContacts;
window.clearAllData = clearAllData;

console.log('测试数据生成脚本已加载！');
console.log('在控制台中执行以下命令：');
console.log('- generateAllTestData() - 生成100条客户和100条联系人数据');
console.log('- insertTestAccounts(count) - 插入指定数量的客户数据');
console.log('- insertTestContacts(count, accounts) - 插入指定数量的联系人数据');
console.log('- clearAllData() - 清空所有数据');
