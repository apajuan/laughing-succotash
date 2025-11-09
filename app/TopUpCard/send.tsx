async function sendData(card_id: string, amount: string) {
  const api = `http://localhost/IT155P/wemos/topUp.php?amount=${amount}&card_id=${card_id}`;
  const res = await fetch(api);
  return res.json();
}

export async function SendTopUp(CardID: string, Amount: string) {
  const a = await sendData(CardID, Amount);
}
