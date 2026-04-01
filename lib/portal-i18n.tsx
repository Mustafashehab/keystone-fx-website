'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type PortalLang = 'en' | 'ar'
type Dir = 'ltr' | 'rtl'

interface PortalTranslations {
  dir: Dir
  nav: {
    dashboard: string
    kyc: string
    documents: string
    accountApplication: string
    deposit: string
    withdrawal: string
    support: string
    settings: string
    signOut: string
    clientPortal: string
  }
  kyc: {
    title: string
    subtitle: string
    sections: [string, string, string, string]
    personalInfo: string
    firstName: string
    lastName: string
    dateOfBirth: string
    phoneNumber: string
    nationality: string
    countryOfResidence: string
    countryOptional: string
    address: string
    addressOptional: string
    addressLine1: string
    addressLine2: string
    addressLine1Placeholder: string
    addressLine2Placeholder: string
    city: string
    postalCode: string
    financialProfile: string
    financialOptional: string
    employmentStatus: string
    employerName: string
    annualIncomeRange: string
    sourceOfFunds: string
    tradingExperience: string
    investmentObjectives: string
    investmentOptional: string
    declarations: string
    declarationsOptional: string
    taxResidency: string
    taxId: string
    pepLabel: string
    pepDesc: string
    pepDetails: string
    pepDetailsPlaceholder: string
    usPersonLabel: string
    usPersonDesc: string
    next: string
    back: string
    nextAddress: string
    nextFinancial: string
    nextDeclarations: string
    saveAndContinue: string
    approved: string
    underReview: string
    rejected: string
    rejectedDesc: string
    selectNationality: string
    selectCountry: string
    selectStatus: string
    selectRange: string
    selectSource: string
    selectExperience: string
    selectCountryPlaceholder: string
    phonePlaceholder: string
    employment: {
      employed: string
      selfEmployed: string
      businessOwner: string
      retired: string
      unemployed: string
      student: string
    }
    income: {
      under25k: string
      k25_50: string
      k50_100: string
      k100_250: string
      k250_500: string
      over500k: string
    }
    funds: {
      employment: string
      business: string
      investments: string
      inheritance: string
      propertySale: string
      savings: string
      other: string
    }
    experience: {
      none: string
      less1yr: string
      yr1_3: string
      yr3_5: string
      yr5_10: string
      over10yr: string
    }
    objectives: {
      capitalGrowth: string
      income: string
      hedging: string
      speculation: string
      diversification: string
    }
  }
  deposit: {
    title: string
    subtitle: string
    kycRequired: string
    kycRequiredDesc: string
    generateWallet: string
    generateWalletDesc: string
    generateBtn: string
    depositAddress: string
    copy: string
    copied: string
    walletBalance: string
    currentBalance: string
    totalDeposited: string
    lastChecked: string
    neverChecked: string
    checkDeposits: string
    transactionHistory: string
    noDeposits: string
    noDepositsDesc: string
    addedToMT5: string
    pending: string
    serviceUnavailable: string
    serviceUnavailableDesc: string
    contactWhatsApp: string
    depositConfirmed: string
    depositOf: string
    addedToAccount: string
  }
  withdrawal: {
    title: string
    subtitle: string
    kycRequired: string
    kycRequiredDesc: string
    noWallet: string
    noWalletDesc: string
    pendingRequest: string
    pendingRequestDesc: string
    newRequest: string
    complianceWarning: string
    mt5Account: string
    mt5Placeholder: string
    amount: string
    amountPlaceholder: string
    destination: string
    destinationPlaceholder: string
    registeredWallet: string
    submitRequest: string
    history: string
    noHistory: string
    serviceUnavailable: string
    serviceUnavailableDesc: string
    contactWhatsApp: string
  }
  documents: {
    title: string
    subtitle: string
    infoAlert: string
    passport: string
    passportDesc: string
    proofOfAddress: string
    proofOfAddressDesc: string
    bankStatement: string
    bankStatementDesc: string
    upload: string
    verified: string
    continueToApplication: string
    rejected: string
    rejectedDesc: string
  }
  settings: {
    title: string
    subtitle: string
    emailSection: string
    emailLabel: string
    emailHint: string
    updateEmail: string
    passwordSection: string
    newPassword: string
    newPasswordHint: string
    confirmPassword: string
    changePassword: string
    notificationsSection: string
    dangerZone: string
    dangerZoneDesc: string
    closeAccount: string
    notifications: {
      kycUpdates: string
      kycUpdatesDesc: string
      documentUpdates: string
      documentUpdatesDesc: string
      ticketReplies: string
      ticketRepliesDesc: string
      accountUpdates: string
      accountUpdatesDesc: string
      marketing: string
      marketingDesc: string
    }
  }
  support: {
    title: string
    subtitle: string
    newTicket: string
    totalTickets: string
    openInProgress: string
    resolved: string
    yourTickets: string
    noTickets: string
    noTicketsDesc: string
    createFirst: string
    newTicketTitle: string
    newTicketDesc: string
    subject: string
    subjectPlaceholder: string
    description: string
    descriptionPlaceholder: string
    priority: string
    category: string
    submitTicket: string
    cancel: string
    opened: string
    priority_options: {
      low: string
      medium: string
      high: string
      urgent: string
    }
    category_options: {
      verification: string
      documents: string
      application: string
      technical: string
      other: string
    }
  }
  dashboard: {
    welcomeBack: string
    subtitle: string
    profileSetup: string
    profileSetupDesc: string
    startVerification: string
    kycStatus: string
    documentsVerified: string
    pending: string
    application: string
    submitted: string
    notStarted: string
    openTickets: string
    onboardingProgress: string
    documentUpload: string
    documentUploadDesc: string
    accountApplication: string
    accountApplicationDesc: string
    approval: string
    approvalDesc: string
    accountOverview: string
    fullName: string
    email: string
    accountType: string
    memberSince: string
    editProfile: string
    recentTickets: string
    viewAll: string
    onboardingBanner: {
      uploadDocs: string
      uploadDocsBody: string
      uploadDocsCta: string
      submitApp: string
      submitAppBody: string
      submitAppCta: string
      underReview: string
      underReviewBody: string
      underReviewCta: string
    }
    kycLabel: {
      not_started: string
      pending: string
      under_review: string
      approved: string
      rejected: string
    }
    accountTypeLabel: {
      individual: string
      professional: string
      institutional: string
    }
  }
}

const translations: Record<PortalLang, PortalTranslations> = {
  en: {
    dir: 'ltr',
    nav: {
      dashboard:          'Dashboard',
      kyc:                'KYC Verification',
      documents:          'Documents',
      accountApplication: 'Account Application',
      deposit:            'Deposit USDT',
      withdrawal:         'Withdraw USDT',
      support:            'Support',
      settings:           'Settings',
      signOut:            'Sign out',
      clientPortal:       'Client Portal',
    },
    kyc: {
      title:                  'KYC Verification',
      subtitle:               'Complete your Know Your Customer profile to activate your account.',
      sections:               ['Personal Info', 'Address', 'Financial Profile', 'Declarations'],
      personalInfo:           'Personal Information',
      firstName:              'First Name',
      lastName:               'Last Name',
      dateOfBirth:            'Date of Birth',
      phoneNumber:            'Phone Number',
      nationality:            'Nationality',
      countryOfResidence:     'Country of Residence',
      countryOptional:        'Select country (optional)',
      address:                'Residential Address',
      addressOptional:        '(optional)',
      addressLine1:           'Address Line 1',
      addressLine2:           'Address Line 2',
      addressLine1Placeholder:'Street address',
      addressLine2Placeholder:'Apartment, suite, etc.',
      city:                   'City',
      postalCode:             'Postal Code',
      financialProfile:       'Financial Profile',
      financialOptional:      '(optional)',
      employmentStatus:       'Employment Status',
      employerName:           'Employer / Company Name',
      annualIncomeRange:      'Annual Income Range',
      sourceOfFunds:          'Source of Funds',
      tradingExperience:      'Trading Experience',
      investmentObjectives:   'Investment Objectives',
      investmentOptional:     '(optional)',
      declarations:           'Regulatory Declarations',
      declarationsOptional:   '(optional)',
      taxResidency:           'Tax Residency',
      taxId:                  'Tax ID / TIN',
      pepLabel:               'I am a Politically Exposed Person (PEP)',
      pepDesc:                'A PEP is someone who holds or has held a prominent public position.',
      pepDetails:             'PEP Details',
      pepDetailsPlaceholder:  'Please describe your position and the relevant country.',
      usPersonLabel:          'I am a US Person',
      usPersonDesc:           'Includes US citizens, residents, and entities with US tax obligations.',
      next:                   'Next',
      back:                   '← Back',
      nextAddress:            'Next: Address →',
      nextFinancial:          'Next: Financial Profile →',
      nextDeclarations:       'Next: Declarations →',
      saveAndContinue:        'Save & Continue',
      approved:               'Your KYC has been approved. No further action required.',
      underReview:            'Your KYC submission is currently under review. You will be notified of any updates.',
      rejected:               'KYC Rejected',
      rejectedDesc:           'Please correct the information below and resubmit.',
      selectNationality:      'Select nationality',
      selectCountry:          'Select country',
      selectStatus:           'Select status',
      selectRange:            'Select range',
      selectSource:           'Select source',
      selectExperience:       'Select experience',
      selectCountryPlaceholder:'Select country (optional)',
      phonePlaceholder:       '+1 234 567 8900',
      employment: {
        employed:     'Employed',
        selfEmployed: 'Self-Employed',
        businessOwner:'Business Owner',
        retired:      'Retired',
        unemployed:   'Unemployed',
        student:      'Student',
      },
      income: {
        under25k: 'Under $25,000',
        k25_50:   '$25,000 – $50,000',
        k50_100:  '$50,000 – $100,000',
        k100_250: '$100,000 – $250,000',
        k250_500: '$250,000 – $500,000',
        over500k: 'Over $500,000',
      },
      funds: {
        employment:   'Employment Income',
        business:     'Business Income',
        investments:  'Investments',
        inheritance:  'Inheritance / Gift',
        propertySale: 'Property Sale',
        savings:      'Savings',
        other:        'Other',
      },
      experience: {
        none:     'No experience',
        less1yr:  'Less than 1 year',
        yr1_3:    '1 – 3 years',
        yr3_5:    '3 – 5 years',
        yr5_10:   '5 – 10 years',
        over10yr: 'More than 10 years',
      },
      objectives: {
        capitalGrowth:   'Capital Growth',
        income:          'Income Generation',
        hedging:         'Hedging',
        speculation:     'Speculation',
        diversification: 'Diversification',
      },
    },
    deposit: {
      title:                'Deposit USDT',
      subtitle:             'Send USDT (TRC-20) to your unique wallet address below.',
      kycRequired:          'KYC Required',
      kycRequiredDesc:      'Your KYC must be approved before you can deposit.',
      generateWallet:       'Generate Your Deposit Wallet',
      generateWalletDesc:   'You need a unique TRC-20 wallet address to receive USDT deposits.',
      generateBtn:          'Generate Wallet',
      depositAddress:       'Your Deposit Address',
      copy:                 'Copy',
      copied:               'Copied!',
      walletBalance:        'Wallet Balance',
      currentBalance:       'Current Balance',
      totalDeposited:       'Total Deposited',
      lastChecked:          'Last checked: ',
      neverChecked:         'Never checked',
      checkDeposits:        'Check for Deposits',
      transactionHistory:   'Transaction History',
      noDeposits:           'No deposits yet.',
      noDepositsDesc:       'Send USDT to your address above and click Check for Deposits.',
      addedToMT5:           'Added to MT5',
      pending:              'Pending',
      serviceUnavailable:   'Service Temporarily Unavailable',
      serviceUnavailableDesc:'Deposits are currently unavailable. Please contact our support team on WhatsApp and we will assist you directly.',
      contactWhatsApp:      'Contact Support on WhatsApp',
      depositConfirmed:     'Deposit Confirmed',
      depositOf:            'Your deposit of',
      addedToAccount:       'has been added to your MT5 account',
    },
    withdrawal: {
      title:              'Withdraw USDT',
      subtitle:           'Submit a withdrawal request to receive USDT to your TRC-20 wallet.',
      kycRequired:        'KYC Required',
      kycRequiredDesc:    'Your KYC must be approved before you can submit a withdrawal request.',
      noWallet:           'No Deposit Wallet Found',
      noWalletDesc:       'You must make a deposit first before submitting a withdrawal request.',
      pendingRequest:     'Pending Request Active',
      pendingRequestDesc: 'You have a pending withdrawal request under review. You cannot submit another until it is resolved.',
      newRequest:         'New Withdrawal Request',
      complianceWarning:  '⚠️ For compliance, withdrawals can only be sent to your registered deposit wallet address.',
      mt5Account:         'MT5 Account Number',
      mt5Placeholder:     'e.g. 12345678',
      amount:             'Amount (USDT) — Minimum $10',
      amountPlaceholder:  'e.g. 100',
      destination:        'Withdrawal Destination (TRC-20)',
      destinationPlaceholder: 'T...',
      registeredWallet:   'Your registered wallet: ',
      submitRequest:      'Submit Withdrawal Request',
      history:            'Withdrawal History',
      noHistory:          'No withdrawal requests yet.',
      serviceUnavailable: 'Service Temporarily Unavailable',
      serviceUnavailableDesc: 'Withdrawals are currently unavailable. Please contact our support team on WhatsApp and we will assist you directly.',
      contactWhatsApp:    'Contact Support on WhatsApp',
    },
    documents: {
      title:              'Document Verification',
      subtitle:           'Upload clear, legible copies of the required documents below.',
      infoAlert:          'All documents must be valid, unedited, and clearly readable. Files must be JPG, PNG, or PDF and under 10 MB each.',
      passport:           'Passport',
      passportDesc:       'Clear colour scan of your valid passport (photo page)',
      proofOfAddress:     'Proof of Address',
      proofOfAddressDesc: 'Utility bill, bank statement, or government letter (issued within 3 months)',
      bankStatement:      'Bank Statement',
      bankStatementDesc:  'Most recent bank statement showing your name and account details',
      upload:             'Upload',
      verified:           'Verified',
      continueToApplication: 'Continue to Account Application →',
      rejected:           'Rejected',
      rejectedDesc:       'Please upload a new document.',
    },
    settings: {
      title:            'Settings',
      subtitle:         'Manage your account preferences and security.',
      emailSection:     'Email Address',
      emailLabel:       'Email address',
      emailHint:        'Changing your email will require re-verification.',
      updateEmail:      'Update Email',
      passwordSection:  'Change Password',
      newPassword:      'New Password',
      newPasswordHint:  'Minimum 8 characters.',
      confirmPassword:  'Confirm New Password',
      changePassword:   'Change Password',
      notificationsSection: 'Notification Preferences',
      dangerZone:       'Danger Zone',
      dangerZoneDesc:   'Closing your account will permanently remove all your data. This action cannot be undone.',
      closeAccount:     'Close Account',
      notifications: {
        kycUpdates:         'KYC status updates',
        kycUpdatesDesc:     'When your KYC review status changes',
        documentUpdates:    'Document review updates',
        documentUpdatesDesc:'When uploaded documents are verified or rejected',
        ticketReplies:      'Support ticket replies',
        ticketRepliesDesc:  'When our team responds to your tickets',
        accountUpdates:     'Account application updates',
        accountUpdatesDesc: 'When your account application status changes',
        marketing:          'Product updates & news',
        marketingDesc:      'Occasional updates about Keystone FX services',
      },
    },
    support: {
      title:          'Support',
      subtitle:       'Get help with your account or submit a new request.',
      newTicket:      'New Ticket',
      totalTickets:   'Total Tickets',
      openInProgress: 'Open / In Progress',
      resolved:       'Resolved',
      yourTickets:    'Your Tickets',
      noTickets:      'No support tickets',
      noTicketsDesc:  "You haven't submitted any support requests yet.",
      createFirst:    'Create your first ticket',
      newTicketTitle: 'New Support Ticket',
      newTicketDesc:  "Describe your issue and we'll get back to you as soon as possible.",
      subject:        'Subject',
      subjectPlaceholder:    'Brief description of your issue',
      description:    'Description',
      descriptionPlaceholder:'Please provide as much detail as possible…',
      priority:       'Priority',
      category:       'Category',
      submitTicket:   'Submit Ticket',
      cancel:         'Cancel',
      opened:         'Opened',
      priority_options: {
        low:    'Low',
        medium: 'Medium',
        high:   'High',
        urgent: 'Urgent',
      },
      category_options: {
        verification: 'Account Verification',
        documents:    'Document Upload',
        application:  'Account Application',
        technical:    'Technical Issue',
        other:        'Other',
      },
    },
    dashboard: {
      welcomeBack:          'Welcome back,',
      subtitle:             'Monitor your onboarding status, account profile, and recent support activity.',
      profileSetup:         'Profile Setup Required',
      profileSetupDesc:     'Please complete your onboarding to continue.',
      startVerification:    'Start Verification',
      kycStatus:            'KYC Status',
      documentsVerified:    'Documents Verified',
      pending:              'pending',
      application:          'Application',
      submitted:            'Submitted',
      notStarted:           'Not Started',
      openTickets:          'Open Tickets',
      onboardingProgress:   'Onboarding Progress',
      documentUpload:       'Document Upload',
      documentUploadDesc:   'Upload identity and address documents',
      accountApplication:   'Account Application',
      accountApplicationDesc: 'Submit your trading configuration',
      approval:             'Approval',
      approvalDesc:         'Review by Keystone FX team',
      accountOverview:      'Account Overview',
      fullName:             'Full Name',
      email:                'Email',
      accountType:          'Account Type',
      memberSince:          'Member Since',
      editProfile:          'Edit profile →',
      recentTickets:        'Recent Support Tickets',
      viewAll:              'View all',
      onboardingBanner: {
        uploadDocs:     'Upload your documents',
        uploadDocsBody: 'Upload the required identity and address documents.',
        uploadDocsCta:  'Upload Documents',
        submitApp:      'Submit your account application',
        submitAppBody:  'Documents received. Configure and submit your trading account preferences.',
        submitAppCta:   'Apply Now',
        underReview:    'Application under review',
        underReviewBody:'Your application has been submitted. Our team will review it shortly.',
        underReviewCta: 'View Status',
      },
      kycLabel: {
        not_started:  'Not Started',
        pending:      'Pending',
        under_review: 'In Review',
        approved:     'Approved',
        rejected:     'Rejected',
      },
      accountTypeLabel: {
        individual:    'Individual',
        professional:  'Professional',
        institutional: 'Institutional',
      },
    },
  },

  ar: {
    dir: 'rtl',
    nav: {
      dashboard:          'لوحة التحكم',
      kyc:                'التحقق من الهوية',
      documents:          'المستندات',
      accountApplication: 'طلب الحساب',
      deposit:            'إيداع USDT',
      withdrawal:         'سحب USDT',
      support:            'الدعم',
      settings:           'الإعدادات',
      signOut:            'تسجيل الخروج',
      clientPortal:       'بوابة العميل',
    },
    kyc: {
      title:                  'التحقق من الهوية (KYC)',
      subtitle:               'أكمل ملف تعريف اعرف عميلك لتفعيل حسابك.',
      sections:               ['المعلومات الشخصية', 'العنوان', 'الملف المالي', 'الإقرارات'],
      personalInfo:           'المعلومات الشخصية',
      firstName:              'الاسم الأول',
      lastName:               'اسم العائلة',
      dateOfBirth:            'تاريخ الميلاد',
      phoneNumber:            'رقم الهاتف',
      nationality:            'الجنسية',
      countryOfResidence:     'بلد الإقامة',
      countryOptional:        'اختر البلد (اختياري)',
      address:                'عنوان السكن',
      addressOptional:        '(اختياري)',
      addressLine1:           'سطر العنوان 1',
      addressLine2:           'سطر العنوان 2',
      addressLine1Placeholder:'عنوان الشارع',
      addressLine2Placeholder:'الشقة، الجناح، إلخ.',
      city:                   'المدينة',
      postalCode:             'الرمز البريدي',
      financialProfile:       'الملف المالي',
      financialOptional:      '(اختياري)',
      employmentStatus:       'الحالة الوظيفية',
      employerName:           'اسم صاحب العمل / الشركة',
      annualIncomeRange:      'نطاق الدخل السنوي',
      sourceOfFunds:          'مصدر الأموال',
      tradingExperience:      'خبرة التداول',
      investmentObjectives:   'أهداف الاستثمار',
      investmentOptional:     '(اختياري)',
      declarations:           'الإقرارات التنظيمية',
      declarationsOptional:   '(اختياري)',
      taxResidency:           'الإقامة الضريبية',
      taxId:                  'رقم التعريف الضريبي / TIN',
      pepLabel:               'أنا شخص ذو صفة سياسية بارزة (PEP)',
      pepDesc:                'الشخص ذو الصفة السياسية هو من يشغل أو شغل منصباً عاماً بارزاً.',
      pepDetails:             'تفاصيل الصفة السياسية',
      pepDetailsPlaceholder:  'يرجى وصف منصبك والبلد المعني.',
      usPersonLabel:          'أنا شخص أمريكي',
      usPersonDesc:           'يشمل المواطنين الأمريكيين والمقيمين والكيانات ذات الالتزامات الضريبية الأمريكية.',
      next:                   'التالي',
      back:                   'رجوع →',
      nextAddress:            'التالي: العنوان →',
      nextFinancial:          'التالي: الملف المالي →',
      nextDeclarations:       'التالي: الإقرارات →',
      saveAndContinue:        'حفظ ومتابعة',
      approved:               'تمت الموافقة على KYC الخاص بك. لا يلزم اتخاذ أي إجراء آخر.',
      underReview:            'طلب KYC الخاص بك قيد المراجعة حاليًا. ستتلقى إشعارًا بأي تحديثات.',
      rejected:               'تم رفض KYC',
      rejectedDesc:           'يرجى تصحيح المعلومات أدناه وإعادة التقديم.',
      selectNationality:      'اختر الجنسية',
      selectCountry:          'اختر البلد',
      selectStatus:           'اختر الحالة',
      selectRange:            'اختر النطاق',
      selectSource:           'اختر المصدر',
      selectExperience:       'اختر الخبرة',
      selectCountryPlaceholder:'اختر البلد (اختياري)',
      phonePlaceholder:       '+966 5XX XXX XXXX',
      employment: {
        employed:     'موظف',
        selfEmployed: 'عمل حر',
        businessOwner:'صاحب عمل',
        retired:      'متقاعد',
        unemployed:   'عاطل عن العمل',
        student:      'طالب',
      },
      income: {
        under25k: 'أقل من $25,000',
        k25_50:   '$25,000 – $50,000',
        k50_100:  '$50,000 – $100,000',
        k100_250: '$100,000 – $250,000',
        k250_500: '$250,000 – $500,000',
        over500k: 'أكثر من $500,000',
      },
      funds: {
        employment:   'دخل من العمل',
        business:     'دخل تجاري',
        investments:  'استثمارات',
        inheritance:  'ميراث / هبة',
        propertySale: 'بيع عقار',
        savings:      'مدخرات',
        other:        'أخرى',
      },
      experience: {
        none:     'لا توجد خبرة',
        less1yr:  'أقل من سنة',
        yr1_3:    '1 – 3 سنوات',
        yr3_5:    '3 – 5 سنوات',
        yr5_10:   '5 – 10 سنوات',
        over10yr: 'أكثر من 10 سنوات',
      },
      objectives: {
        capitalGrowth:   'نمو رأس المال',
        income:          'توليد الدخل',
        hedging:         'التحوط',
        speculation:     'المضاربة',
        diversification: 'التنويع',
      },
    },
    deposit: {
      title:                'إيداع USDT',
      subtitle:             'أرسل USDT (TRC-20) إلى عنوان محفظتك الفريد أدناه.',
      kycRequired:          'مطلوب التحقق من الهوية',
      kycRequiredDesc:      'يجب الموافقة على KYC الخاص بك قبل أن تتمكن من الإيداع.',
      generateWallet:       'إنشاء محفظة الإيداع',
      generateWalletDesc:   'تحتاج إلى عنوان محفظة TRC-20 فريد لاستلام ودائع USDT.',
      generateBtn:          'إنشاء محفظة',
      depositAddress:       'عنوان الإيداع الخاص بك',
      copy:                 'نسخ',
      copied:               'تم النسخ!',
      walletBalance:        'رصيد المحفظة',
      currentBalance:       'الرصيد الحالي',
      totalDeposited:       'إجمالي الإيداعات',
      lastChecked:          'آخر فحص: ',
      neverChecked:         'لم يتم الفحص',
      checkDeposits:        'التحقق من الإيداعات',
      transactionHistory:   'سجل المعاملات',
      noDeposits:           'لا توجد إيداعات حتى الآن.',
      noDepositsDesc:       'أرسل USDT إلى عنوانك أعلاه وانقر على التحقق من الإيداعات.',
      addedToMT5:           'تمت الإضافة إلى MT5',
      pending:              'قيد الانتظار',
      serviceUnavailable:   'الخدمة غير متاحة مؤقتاً',
      serviceUnavailableDesc:'خدمة الإيداع غير متاحة حالياً. يرجى التواصل مع فريق الدعم عبر WhatsApp وسنساعدك مباشرة.',
      contactWhatsApp:      'تواصل مع الدعم عبر WhatsApp',
      depositConfirmed:     'تم تأكيد الإيداع',
      depositOf:            'تم إيداع مبلغ',
      addedToAccount:       'وإضافته إلى حساب MT5 الخاص بك',
    },
    withdrawal: {
      title:              'سحب USDT',
      subtitle:           'قدّم طلب سحب لاستلام USDT في محفظة TRC-20 الخاصة بك.',
      kycRequired:        'مطلوب التحقق من الهوية',
      kycRequiredDesc:    'يجب الموافقة على KYC قبل تقديم طلب سحب.',
      noWallet:           'لم يتم العثور على محفظة إيداع',
      noWalletDesc:       'يجب إجراء إيداع أولاً قبل تقديم طلب سحب.',
      pendingRequest:     'يوجد طلب معلق',
      pendingRequestDesc: 'لديك طلب سحب قيد المراجعة. لا يمكنك تقديم طلب آخر حتى يتم حله.',
      newRequest:         'طلب سحب جديد',
      complianceWarning:  '⚠️ للامتثال التنظيمي، يمكن إرسال المسحوبات فقط إلى عنوان محفظة الإيداع المسجل.',
      mt5Account:         'رقم حساب MT5',
      mt5Placeholder:     'مثال: 12345678',
      amount:             'المبلغ (USDT) — الحد الأدنى $10',
      amountPlaceholder:  'مثال: 100',
      destination:        'وجهة السحب (TRC-20)',
      destinationPlaceholder: 'T...',
      registeredWallet:   'محفظتك المسجلة: ',
      submitRequest:      'تقديم طلب السحب',
      history:            'سجل المسحوبات',
      noHistory:          'لا توجد طلبات سحب حتى الآن.',
      serviceUnavailable: 'الخدمة غير متاحة مؤقتاً',
      serviceUnavailableDesc: 'خدمة السحب غير متاحة حالياً. يرجى التواصل مع فريق الدعم عبر WhatsApp وسنساعدك مباشرة.',
      contactWhatsApp:    'تواصل مع الدعم عبر WhatsApp',
    },
    documents: {
      title:              'التحقق من المستندات',
      subtitle:           'قم بتحميل نسخ واضحة ومقروءة من المستندات المطلوبة أدناه.',
      infoAlert:          'يجب أن تكون جميع المستندات صالحة وغير معدلة وواضحة القراءة. يجب أن تكون الملفات بصيغة JPG أو PNG أو PDF وأقل من 10 ميغابايت لكل منها.',
      passport:           'جواز السفر',
      passportDesc:       'نسخة ملونة واضحة من جواز سفرك الساري (صفحة الصورة)',
      proofOfAddress:     'إثبات العنوان',
      proofOfAddressDesc: 'فاتورة مرافق أو كشف حساب بنكي أو خطاب حكومي (صادر خلال 3 أشهر)',
      bankStatement:      'كشف الحساب البنكي',
      bankStatementDesc:  'أحدث كشف حساب بنكي يظهر اسمك وتفاصيل حسابك',
      upload:             'رفع',
      verified:           'تم التحقق',
      continueToApplication: 'متابعة إلى طلب الحساب →',
      rejected:           'مرفوض',
      rejectedDesc:       'يرجى رفع مستند جديد.',
    },
    settings: {
      title:            'الإعدادات',
      subtitle:         'إدارة تفضيلات حسابك والأمان.',
      emailSection:     'عنوان البريد الإلكتروني',
      emailLabel:       'البريد الإلكتروني',
      emailHint:        'تغيير بريدك الإلكتروني سيتطلب إعادة التحقق.',
      updateEmail:      'تحديث البريد الإلكتروني',
      passwordSection:  'تغيير كلمة المرور',
      newPassword:      'كلمة المرور الجديدة',
      newPasswordHint:  'الحد الأدنى 8 أحرف.',
      confirmPassword:  'تأكيد كلمة المرور الجديدة',
      changePassword:   'تغيير كلمة المرور',
      notificationsSection: 'تفضيلات الإشعارات',
      dangerZone:       'منطقة الخطر',
      dangerZoneDesc:   'سيؤدي إغلاق حسابك إلى إزالة جميع بياناتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.',
      closeAccount:     'إغلاق الحساب',
      notifications: {
        kycUpdates:         'تحديثات حالة KYC',
        kycUpdatesDesc:     'عند تغيير حالة مراجعة KYC الخاصة بك',
        documentUpdates:    'تحديثات مراجعة المستندات',
        documentUpdatesDesc:'عند التحقق من المستندات المرفوعة أو رفضها',
        ticketReplies:      'ردود تذاكر الدعم',
        ticketRepliesDesc:  'عندما يرد فريقنا على تذاكرك',
        accountUpdates:     'تحديثات طلب الحساب',
        accountUpdatesDesc: 'عند تغيير حالة طلب حسابك',
        marketing:          'تحديثات المنتجات والأخبار',
        marketingDesc:      'تحديثات دورية حول خدمات Keystone FX',
      },
    },
    support: {
      title:          'الدعم',
      subtitle:       'احصل على مساعدة في حسابك أو قدم طلباً جديداً.',
      newTicket:      'تذكرة جديدة',
      totalTickets:   'إجمالي التذاكر',
      openInProgress: 'مفتوح / قيد التنفيذ',
      resolved:       'تم الحل',
      yourTickets:    'تذاكرك',
      noTickets:      'لا توجد تذاكر دعم',
      noTicketsDesc:  'لم تقدم أي طلبات دعم بعد.',
      createFirst:    'أنشئ أول تذكرة لك',
      newTicketTitle: 'تذكرة دعم جديدة',
      newTicketDesc:  'صف مشكلتك وسنرد عليك في أقرب وقت ممكن.',
      subject:        'الموضوع',
      subjectPlaceholder:    'وصف موجز لمشكلتك',
      description:    'الوصف',
      descriptionPlaceholder:'يرجى تقديم أكبر قدر من التفاصيل…',
      priority:       'الأولوية',
      category:       'الفئة',
      submitTicket:   'إرسال التذكرة',
      cancel:         'إلغاء',
      opened:         'تم الفتح',
      priority_options: {
        low:    'منخفض',
        medium: 'متوسط',
        high:   'مرتفع',
        urgent: 'عاجل',
      },
      category_options: {
        verification: 'التحقق من الحساب',
        documents:    'رفع المستندات',
        application:  'طلب الحساب',
        technical:    'مشكلة تقنية',
        other:        'أخرى',
      },
    },
    dashboard: {
      welcomeBack:          'مرحباً بعودتك،',
      subtitle:             'تابع حالة التسجيل وملفك الشخصي ونشاط الدعم الأخير.',
      profileSetup:         'إعداد الملف الشخصي مطلوب',
      profileSetupDesc:     'يرجى إكمال التسجيل للمتابعة.',
      startVerification:    'بدء التحقق',
      kycStatus:            'حالة KYC',
      documentsVerified:    'المستندات الموثقة',
      pending:              'قيد الانتظار',
      application:          'الطلب',
      submitted:            'تم الإرسال',
      notStarted:           'لم يبدأ',
      openTickets:          'التذاكر المفتوحة',
      onboardingProgress:   'تقدم التسجيل',
      documentUpload:       'رفع المستندات',
      documentUploadDesc:   'ارفع مستندات الهوية والعنوان',
      accountApplication:   'طلب الحساب',
      accountApplicationDesc: 'قدم إعدادات حساب التداول',
      approval:             'الموافقة',
      approvalDesc:         'مراجعة من فريق Keystone FX',
      accountOverview:      'نظرة عامة على الحساب',
      fullName:             'الاسم الكامل',
      email:                'البريد الإلكتروني',
      accountType:          'نوع الحساب',
      memberSince:          'عضو منذ',
      editProfile:          '← تعديل الملف الشخصي',
      recentTickets:        'تذاكر الدعم الأخيرة',
      viewAll:              'عرض الكل',
      onboardingBanner: {
        uploadDocs:     'ارفع مستنداتك',
        uploadDocsBody: 'ارفع مستندات الهوية والعنوان المطلوبة.',
        uploadDocsCta:  'رفع المستندات',
        submitApp:      'قدم طلب حسابك',
        submitAppBody:  'تم استلام المستندات. قم بتهيئة وتقديم تفضيلات حساب التداول.',
        submitAppCta:   'تقديم الآن',
        underReview:    'الطلب قيد المراجعة',
        underReviewBody:'تم تقديم طلبك. سيراجعه فريقنا قريباً.',
        underReviewCta: 'عرض الحالة',
      },
      kycLabel: {
        not_started:  'لم يبدأ',
        pending:      'قيد الانتظار',
        under_review: 'قيد المراجعة',
        approved:     'مُعتمد',
        rejected:     'مرفوض',
      },
      accountTypeLabel: {
        individual:    'فردي',
        professional:  'محترف',
        institutional: 'مؤسسي',
      },
    },
  },
}

interface PortalI18nContextValue {
  lang:   PortalLang
  t:      PortalTranslations
  toggle: () => void
}

const PortalI18nContext = createContext<PortalI18nContextValue>({
  lang:   'en',
  t:      translations.en,
  toggle: () => {},
})

export function PortalI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<PortalLang>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = localStorage.getItem('portal-lang')
    return saved === 'ar' ? 'ar' : 'en'
  })

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir
    document.documentElement.lang = lang
  }, [lang])

  function toggle() {
    const next: PortalLang = lang === 'en' ? 'ar' : 'en'
    setLang(next)
    localStorage.setItem('portal-lang', next)
  }

  return (
    <PortalI18nContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </PortalI18nContext.Provider>
  )
}

export function usePortalI18n() {
  return useContext(PortalI18nContext)
}