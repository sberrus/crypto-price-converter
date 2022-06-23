import { FormEvent, ReactEventHandler, useState } from "react";
const convert = require("ethereum-unit-converter");

const App = () => {
	const [usd, setUsd] = useState<number>(1);
	const [result, setResult] = useState<number>(0);

	const getConvertionRate = async () => {
		try {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false"
			);

			const jsonRes = await res.json();

			return jsonRes[0].current_price;
		} catch (error) {
			return null;
		}
	};

	const handleUsdChange = (num: number) => {
		setUsd(num);
	};

	const handleCopyButton = async () => {
		if (!navigator.clipboard) {
			alert("No tiene la api CLIPBOARD");
			return;
		}
		await navigator.clipboard.writeText(result + "");
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const convertionRate = await getConvertionRate();
		const ethConvertion = (1 * usd) / convertionRate;
		const weiConvertion = convert(ethConvertion, "ether");
		setResult(Math.trunc(weiConvertion.wei));
	};

	return (
		<div>
			<form
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<label>usd</label>
				<input
					type="number"
					value={usd}
					onChange={(e) => {
						handleUsdChange(Number(e.currentTarget.value));
					}}
				/>
				<button type="submit">Convertir</button>
			</form>
			<h5>result</h5>
			<span>{result} wei</span>
			<button onClick={handleCopyButton}>Copiar Monto</button>
		</div>
	);
};

export default App;
