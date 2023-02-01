export function generateAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: token };
}
