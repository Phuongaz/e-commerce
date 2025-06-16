package utils

import (
	"strings"
	"unicode"

	"golang.org/x/text/unicode/norm"
)

func RemoveDiacritics(input string) string {

	t := norm.NFD.String(input)
	var result []rune
	for _, r := range t {
		if unicode.Is(unicode.Mn, r) {
			continue
		}
		result = append(result, r)
	}
	return strings.ToLower(strings.Join(strings.Fields(string(result)), "-"))
}
