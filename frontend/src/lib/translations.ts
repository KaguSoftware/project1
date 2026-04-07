/** Arabic translations for the document preview and form. */

type Lang = "en" | "ar";

const ar: Record<string, string> = {
	// Section headings
	"Executive Summary": "الملخص التنفيذي",
	"Engagement Overview": "نظرة عامة على التعاون",
	"Scope of Work": "نطاق العمل",
	"Scope of Services": "نطاق الخدمات",
	"Deliverables": "المخرجات",
	"Terms & Conditions": "الشروط والأحكام",
	"Payment Terms": "شروط الدفع",
	"Agreement Overview": "نظرة عامة على الاتفاقية",
	"Message": "الرسالة",
	"Billing Details": "تفاصيل الفاتورة",
	"Performance Metrics": "مقاييس الأداء",
	"Top Posts": "أبرز المنشورات",
	"Weekly Summary": "الملخص الأسبوعي",
	"Sales Metrics": "مقاييس المبيعات",
	"Deal Breakdown": "تفاصيل الصفقات",
	"Campaign Overview": "نظرة عامة على الحملة",
	"Campaign KPIs": "مؤشرات أداء الحملة",
	"Influencer Roster": "قائمة المؤثرين",
	"Additional Notes": "ملاحظات إضافية",

	// Table columns / labels
	"Deliverable": "المخرج",
	"Timeline": "الجدول الزمني",
	"Status": "الحالة",
	"Pending": "قيد الانتظار",
	"Description": "الوصف",
	"Qty": "الكمية",
	"Rate": "السعر",
	"Total": "الإجمالي",
	"Metric": "المقياس",
	"Number": "الرقم",
	"Change": "التغيير",
	"Post": "المنشور",
	"Likes": "الإعجابات",
	"Comments": "التعليقات",
	"Shares": "المشاركات",
	"Client": "العميل",
	"Deal Value": "قيمة الصفقة",
	"Stage": "المرحلة",
	"Influencer": "المؤثر",
	"Platform": "المنصة",
	"Followers": "المتابعون",
	"Fee": "الرسوم",
	"Name": "الاسم",

	// Engagement overview labels
	"Package": "الباقة",
	"Valid Until": "صالح حتى",
	"Popular": "الأكثر شيوعاً",

	// Header / footer
	"Reference": "المرجع",
	"Untitled Project": "مشروع بدون عنوان",
	"Official Document": "وثيقة رسمية",
	"Prepared For": "معد لـ",
	"Client Name": "اسم العميل",
	"Project Description": "وصف المشروع",
	"Confidential": "سري",

	// Doc types
	"proposal": "عرض",
	"contract": "عقد",
	"invoice": "فاتورة",
	"letter": "رسالة",
	"social media report": "تقرير وسائل التواصل",
	"weekly sales report": "تقرير المبيعات الأسبوعي",
	"influencer campaign": "حملة المؤثرين",

	// Section order panel
	"Section Order": "ترتيب الأقسام",
	"Add Section": "إضافة قسم",
	"Empty": "فارغ",

	// KPI labels
	"Views": "المشاهدات",
	"Engagement": "التفاعل",
	"Clicks": "النقرات",
	"Conversions": "التحويلات",
	"ROI": "العائد على الاستثمار",

	// ── Form labels ──────────────────────────────────────────────────────────
	// Sidebar / global
	"Document Builder": "منشئ الوثائق",
	"Select Document Category": "اختر نوع الوثيقة",
	"Project Title": "عنوان المشروع",
	"e.g. Q4 Growth Phase": "مثال: مرحلة النمو Q4",
	"e.g. Acme Corp": "مثال: شركة أكمي",
	"Generate": "توليد",
	"Synthesizing...": "جارٍ المعالجة...",

	// Document type labels
	"Proposal": "عرض",
	"Contract": "عقد",
	"Invoice": "فاتورة",
	"Letter": "رسالة",
	"Social": "تواصل اجتماعي",
	"Sales": "مبيعات",
	"Influencer": "مؤثر",

	// Proposal form
	"Proposal Details": "تفاصيل العرض",
	"Executive Introduction": "المقدمة التنفيذية",
	"AI will help refine this...": "سيساعد الذكاء الاصطناعي في تحسين هذا...",
	"Pricing Package": "باقة التسعير",
	"basic": "أساسية",
	"standard": "قياسية",
	"premium": "مميزة",
	"(selected)": "(محددة)",
	"Price (e.g. 999)": "السعر (مثال: 999)",
	"Short description": "وصف مختصر",
	"Popular": "الأكثر شيوعاً",
	"Currency": "العملة",
	"Total Price": "السعر الإجمالي",
	"Valid Until": "صالح حتى",
	"Deliverables": "المخرجات",
	"Deliverable": "المخرج",
	"e.g. Brand Strategy Deck": "مثال: استراتيجية العلامة التجارية",
	"e.g. Week 2": "مثال: الأسبوع 2",
	"Pending": "قيد الانتظار",
	"+ Add Deliverable": "+ إضافة مخرج",
	"Terms & Conditions": "الشروط والأحكام",
	"+ Add Clause": "+ إضافة بند",

	// Contract form
	"Agreement Details": "تفاصيل الاتفاقية",
	"Agreement Overview": "نظرة عامة على الاتفاقية",
	"Scope of Services": "نطاق الخدمات",
	"Deliverables Table": "جدول المخرجات",
	"+ Add Row": "+ إضافة صف",

	// Invoice form
	"Billing Items": "بنود الفاتورة",
	"Description": "الوصف",
	"QTY": "الكمية",
	"Rate": "السعر",
	"Amount": "المبلغ",
	"+ Add Item": "+ إضافة بند",
	"Payment Terms": "شروط الدفع",
	"+ Add Term": "+ إضافة شرط",

	// Letter form
	"Letter Content": "محتوى الرسالة",
	"Message Body": "نص الرسالة",
	"Type your content here...": "اكتب محتواك هنا...",

	// Social Media form
	"Performance Overview": "نظرة عامة على الأداء",
	"Metric": "المقياس",
	"Value": "القيمة",
	"Delta": "التغيير",
	"e.g. Engagement": "مثال: التفاعل",
	"+ Add Metric": "+ إضافة مقياس",
	"Executive Summary": "الملخص التنفيذي",
	"Top Performing Posts": "أفضل المنشورات أداءً",
	"Post": "المنشور",
	"Likes": "الإعجابات",
	"Comm.": "التعليقات",
	"Shares": "المشاركات",
	"+ Add Post": "+ إضافة منشور",

	// Sales form
	"Weekly Sales Metrics": "مقاييس المبيعات الأسبوعية",
	"Metric": "المقياس",
	"Amount": "المبلغ",
	"Weekly Summary": "الملخص الأسبوعي",
	"Deal Breakdown": "تفاصيل الصفقات",
	"Deal Value": "قيمة الصفقة",
	"Stage": "المرحلة",
	"+ Add Deal": "+ إضافة صفقة",

	// Influencer form
	"Influencer Roster": "قائمة المؤثرين",
	"Campaign Overview": "نظرة عامة على الحملة",
	"Influencer List": "قائمة المؤثرين",
	"Full Name": "الاسم الكامل",
	"Platform": "المنصة",
	"Followers": "المتابعون",
	"Fee": "الرسوم",
	"e.g. 50K": "مثال: 50 ألف",
	"e.g. $500": "مثال: 500 دولار",
	"e.g. Confirmed": "مثال: مؤكد",
	"+ Add Influencer": "+ إضافة مؤثر",
	"Campaign KPIs": "مؤشرات أداء الحملة",

	// Custom sections form
	"Custom Sections": "الأقسام المخصصة",
	"Section Header": "عنوان القسم",
	"Section header": "عنوان القسم",
	"Content": "المحتوى",
	"Write your content here…": "اكتب محتواك هنا…",
	"Clauses": "البنود",
	"+ Add Clause": "+ إضافة بند",
};

export function t(key: string, lang: Lang): string {
	if (lang === "ar") return ar[key] ?? key;
	return key;
}
