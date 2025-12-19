// Account （客户）类型定义
export interface Account {
  id: string;
  name: string; // 客户名称，必需
  primarycontactid?: string; // 主联系人ID
  parentaccountid?: string; // 父客户ID
  address1_line1?: string; // 地址1：街道1
  address1_city?: string; // 地址1：城市
  address1_stateorprovince?: string; // 地址1：省/市/自治区
  address1_postalcode?: string; // 地址1：邮政编码
  address1_country?: string; // 地址1：国家/地区
  telephone1?: string; // 主要电话
  websiteurl?: string; // 网站 URL
  industrycode?: IndustryCode; // 行业
  accountcategorycode?: AccountCategoryCode; // 客户规模
  accountnumber?: string; // 客户编号
  defaultpricelevelid?: string; // 价目表ID
  creditlimit?: number; // 信用额度
  lastusedincampaign?: string; // 最后联系日期
  createdAt: string;
  updatedAt: string;
}

// Contact （联系人）类型定义
export interface Contact {
  id: string;
  firstname: string; // 名，必需
  lastname: string; // 姓，必需
  jobtitle?: string; // 职位
  parentcustomerid: string; // 所属客户ID，必需
  department?: string; // 部门
  telephone1?: string; // 商务电话
  mobilephone?: string; // 移动电话
  emailaddress1?: string; // 电子邮件
  address1_line1?: string; // 地址1：街道1
  assistantname?: string; // 助理
  assistantphone?: string; // 助理电话
  birthdate?: string; // 生日
  msdyn_decisioninfluencetag?: DecisionInfluenceTag; // 决策影响标签
  msdyn_gdproptout?: boolean; // GDPR 选择退出
  originatingleadid?: string; // 原始潜在客户ID
  createdAt: string;
  updatedAt: string;
}

// Industry options
export type IndustryCode = 
  | 'Technology' 
  | 'Finance' 
  | 'Healthcare' 
  | 'Retail' 
  | 'Manufacturing' 
  | 'Construction' 
  | 'Energy' 
  | 'Telecommunications' 
  | 'Transportation' 
  | 'Education' 
  | 'Government' 
  | 'Media' 
  | 'Entertainment' 
  | 'Agriculture' 
  | 'Hospitality';

// Account type options
export type AccountCategoryCode = 
  | 'Enterprise' 
  | 'Medium Business' 
  | 'Small Business' 
  | 'Startup' 
  | 'Individual';

// Decision influence tag options
export type DecisionInfluenceTag = 
  | 'Decision Maker' 
  | 'Influencer' 
  | 'Blocker' 
  | 'Supporter' 
  | 'Information Gatherer';

// 新客户表单数据
export interface NewAccountFormData {
  name: string;
  primarycontactid?: string;
  parentaccountid?: string;
  address1_line1?: string;
  address1_city?: string;
  address1_stateorprovince?: string;
  address1_postalcode?: string;
  address1_country?: string;
  telephone1?: string;
  websiteurl?: string;
  industrycode?: IndustryCode;
  accountcategorycode?: AccountCategoryCode;
  accountnumber?: string;
  defaultpricelevelid?: string;
  creditlimit?: number;
  lastusedincampaign?: string;
}

// 新联系人表单数据
export interface NewContactFormData {
  firstname: string;
  lastname: string;
  jobtitle?: string;
  parentcustomerid: string;
  department?: string;
  telephone1?: string;
  mobilephone?: string;
  emailaddress1?: string;
  address1_line1?: string;
  assistantname?: string;
  assistantphone?: string;
  birthdate?: string;
  msdyn_decisioninfluencetag?: DecisionInfluenceTag;
  msdyn_gdproptout?: boolean;
  originatingleadid?: string;
}

// 数据存储键名
export const ACCOUNT_STORAGE_KEY = 'accounts';
export const CONTACT_STORAGE_KEY = 'contacts';
