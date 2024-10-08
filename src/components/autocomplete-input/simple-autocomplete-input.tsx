import { X } from 'lucide-react';
import React, { useState } from 'react';
import ErrorDisplay from '../error-display';
import { ACOption } from './types';

type SimpleAutocompleteInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'defaultValue'
> & {
	label?: string;
	error?: string | string[];
	inputValue?: string;
	onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	defaultInputValue?: string;
	value?: ACOption<string>;
	onChange?: (newValue: ACOption<string> | null) => void;
	defaultValue?: ACOption<string> | null;
	options?: ACOption<string>[];
};

export default function SimpleAutocompleteInput({
	label,
	id,
	name,
	type,
	error,
	inputValue,
	onInputChange,
	defaultInputValue,
	value,
	onChange,
	defaultValue,
	options = [] as ACOption<string>[],
}: SimpleAutocompleteInputProps) {
	const isControlled = typeof inputValue !== 'undefined';
	const isInputControlled = typeof value !== 'undefined';
	const [_inputValue, _setInputValue] = useState(defaultInputValue ?? '');
	const [_value, _setValue] = useState(defaultValue ?? null);

	const filteredOptions = options.filter((op) =>
		op.label
			.toLowerCase()
			.includes((inputValue ?? _inputValue).toLowerCase())
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onInputChange?.(e);
		if (!isInputControlled) _setInputValue(e.target.value);
	};

	const handleValueChange = (newValue: ACOption<string> | null) => {
		onChange?.(newValue);
		if (!isControlled) _setValue(newValue);
		if (!isInputControlled) _setInputValue(newValue?.label ?? '');
	};

	return (
		<div id={id} className="grid w-full">
			{label && (
				<label htmlFor={id} className="mb-1">
					{label}
				</label>
			)}
			<div className="dropdown">
				<div
					className={`input input-bordered ${error && 'input-error'} flex flex-wrap items-center gap-2`}
				>
					<input
						type={type ?? 'text'}
						name={name}
						id={id}
						value={inputValue ?? _inputValue}
						onChange={handleInputChange}
						className="grow"
					/>
					{!!(value ?? _value) && (
						<button
							type="button"
							onClick={() => handleValueChange(null)}
							className="btn btn-circle btn-ghost btn-sm hover:text-error"
						>
							<X />
						</button>
					)}
					<ErrorDisplay error={error} />
				</div>
				<div className="dropdown-content z-[1] mt-1 max-h-80 w-full flex-nowrap overflow-auto rounded-box bg-base-100 p-2 shadow">
					<ul className="menu">
						{filteredOptions.map((option, index) => (
							<li key={option.label} className="text-lg">
								<button
									type="button"
									onClick={() => handleValueChange(option)}
								>
									{option.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
