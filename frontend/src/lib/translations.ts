/** Minimal Arabic translations for the document preview. */

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
};

export function t(key: string, lang: Lang): string {
	if (lang === "ar") return ar[key] ?? key;
	return key;
}
