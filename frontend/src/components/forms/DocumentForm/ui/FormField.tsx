import React from "react";

interface FormFieldProps {
	label: string;
	children: React.ReactNode;
}

export const FormField = ({ label, children }: FormFieldProps) => (
	<div className="form-control w-full">
		<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 px-1">
			{label}
		</label>
		{children}
	</div>
);

export const inputClass =
	"w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none placeholder:text-slate-400 shadow-sm";
